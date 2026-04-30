import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Review } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ReviewCreateInput, ReviewUpdateInput, ReviewWithLikes } from './repository.dto';

// ===========================================================================
// TODO 22: ReviewRepository - 복잡한 Prisma 쿼리 및 좋아요 시스템 구현하기
// ===========================================================================
// ReviewRepository는 리뷰 데이터에 대한 복잡한 Prisma 쿼리를 담당합니다.
// 좋아요 정보를 함께 조회하기 위해 헬퍼 함수를 사용합니다.
//
// === 헬퍼 함수 2개 ===
//
// (A) reviewWithLikeSelect(userId?: number)
//     - Prisma의 select 객체를 리턴하는 함수
//     - 선택할 필드: id, lectureId, userId, content, grade, load, speech, isDeleted
//     - likedUsers: userId가 있으면 { select: { id: true }, where: { id: userId } },
//                  없으면 undefined
//     - _count: { select: { likedUsers: true } }
//
// (B) toReviewWithLikes<T>(review: T): ReviewWithLikes
//     - 제네릭 함수로, Review + likedUsers + _count 타입을 ReviewWithLikes로 변환
//     - review가 null이면 null 반환
//     - 변환 로직:
//       { ...review, liked: !!review.likedUsers?.length,
//         _count: { likedUsers: review._count?.likedUsers ?? 0 } }
//
// === Repository 메서드들 ===
//
// (1) checkUserReviewExistsForLecture(userId, lectureId): Promise<boolean>
//     - prisma.review.findFirst({ where: { userId, lectureId, isDeleted: false } })
//     - 결과가 null이 아니면 true
//
// (2) createReview(data: ReviewCreateInput): Promise<Review>
//     - try: prisma.review.create({ data })
//     - catch: PrismaClientKnownRequestError이고 code가 'P2003'이면
//       FK 제약 조건 위반 에러를 처리합니다:
//       - e.meta?.field_name === 'lectureId' → NotFoundException('Lecture not found')
//       - e.meta?.field_name === 'userId' → NotFoundException('User not found')
//       - 그 외에는 throw e;
//
// (3) updateReview(id, data: ReviewUpdateInput): Promise<Review>
//     - prisma.review.update({ where: { id, isDeleted: false },
//       data: { content, grade, load, speech } })
//
// (4) getReviewById(id): Promise<Review | null>
//     - prisma.review.findUnique({ where: { id, isDeleted: false } })
//
// (5) getReviewWithLikesById(id, userId?): Promise<ReviewWithLikes | null>
//     - toReviewWithLikes(prisma.review.findUnique({ where: ..., select: reviewWithLikeSelect(userId) }))
//
// (6) getReviewsWithLikesByLectureId(lectureId, userId?): Promise<ReviewWithLikes[]>
//     - prisma.review.findMany({ where: { lectureId, isDeleted: false }, select: ... })
//     - 결과를 .map(toReviewWithLikes)
//
// (7) getReviewsWithLikesByCourseId(courseId, userId?): Promise<ReviewWithLikes[]>
//     - prisma.review.findMany({ where: { lecture: { courseId }, isDeleted: false }, select: ... })
//     - 결과를 .map(toReviewWithLikes)
//     힌트: 관계를 통한 필터링 - lecture: { courseId }
//
// (8) getReviewsWithLikesByUserId(userId): Promise<ReviewWithLikes[]>
//     - prisma.review.findMany({ where: { userId, isDeleted: false }, select: ... })
//     - .map(toReviewWithLikes)
//
// (9) getReviewsWithLikesLikedByUser(userId): Promise<ReviewWithLikes[]>
//     - prisma.review.findMany({ where: { likedUsers: { some: { id: userId } }, isDeleted: false },
//       include: { _count: { select: { likedUsers: true } } } })
//     - .map((d) => ({ ...d, liked: true }))
//     힌트: Many-to-Many 관계에서 some을 사용하여 필터링합니다.
//
// (10) likeReview(reviewId, userId): Promise<ReviewWithLikes>
//      - prisma.review.update(
//          where: { id: reviewId, isDeleted: false },
//          data: { likedUsers: { connect: { id: userId } } },
//          select: reviewWithLikeSelect(userId)
//        )
//      - toReviewWithLikes로 변환
//      힌트: M:N 관계에서 connect로 연결합니다.
//
// (11) unlikeReview(reviewId, userId): Promise<ReviewWithLikes>
//      - 위와 동일하지만 data에서 disconnect 사용
//      힌트: M:N 관계에서 disconnect로 연결 해제합니다.
//
// (12) deleteReview(id): Promise<Review>
//      - prisma.review.update({ where: { id, isDeleted: false }, data: { isDeleted: true } })
//      힌트: 소프트 딜리트 패턴 - 실제 삭제 대신 isDeleted 플래그 사용
// ===========================================================================

// TODO: reviewWithLikeSelect 함수를 구현하세요.
// 힌트: userId가 있으면 해당 사용자의 좋아요 여부도 조회합니다.
const reviewWithLikeSelect = (userId?: number) => ({
  id: true,
  lectureId: true,
  userId: true,
  content: true,
  grade: true,
  load: true,
  speech: true,
  isDeleted: true,
  likedUsers: userId
    ? {
        select: {
          id: true,
        },
        where: {
          id: userId,
        },
      }
    : undefined,
  _count: {
    select: {
      likedUsers: true,
    },
  },
});

// TODO: toReviewWithLikes 제네릭 함수를 구현하세요.
// 힌트: liked 필드를 추가하고 _count를 정규화합니다.
function toReviewWithLikes<
  T extends (Review & { likedUsers?: { id: number }[]; _count: { likedUsers: number } }) | null,
>(review: T): T extends null ? ReviewWithLikes | null : ReviewWithLikes {
  if (!review) return null as T extends null ? null : ReviewWithLikes;
  const { likedUsers, _count, ...rest } = review;

    return {
      ...rest,
      liked: !!likedUsers?.length,
      _count: {
        likedUsers: _count?.likedUsers ?? 0,
      },
    } as unknown as T extends null ? ReviewWithLikes | null : ReviewWithLikes;
}

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async checkUserReviewExistsForLecture(
    userId: number,
    lectureId: number,
  ): Promise<boolean> {
    const review = await this.prisma.review.findFirst({
      where: {
        userId,
        lectureId,
        isDeleted: false,
      },
    });

    return review !== null;
  }

  async createReview(data: ReviewCreateInput): Promise<Review> {
    try {
      return await this.prisma.review.create({
        data,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2003'
      ) {
        const fieldName = e.meta?.field_name;

        if (fieldName === 'lectureId') {
          throw new NotFoundException('Lecture not found');
        }

        if (fieldName === 'userId') {
          throw new NotFoundException('User not found');
        }
      }

      throw e;
    }
  }

  async updateReview(id: number, data: ReviewUpdateInput): Promise<Review> {
    return this.prisma.review.update({
      where: {
        id,
        isDeleted: false,
      },
      data: {
        content: data.content,
        grade: data.grade,
        load: data.load,
        speech: data.speech,
      },
    });
  }

  async getReviewById(id: number): Promise<Review | null> {
    return this.prisma.review.findUnique({
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  async getReviewWithLikesById(
    id: number,
    userId?: number,
  ): Promise<ReviewWithLikes | null> {
    const review = await this.prisma.review.findUnique({
      where: {
        id,
        isDeleted: false,
      },
      select: reviewWithLikeSelect(userId),
    });

    return toReviewWithLikes(review);
  }

  async getReviewsWithLikesByLectureId(
    lectureId: number,
    userId?: number,
  ): Promise<ReviewWithLikes[]> {
    const reviews = await this.prisma.review.findMany({
      where: {
        lectureId,
        isDeleted: false,
      },
      select: reviewWithLikeSelect(userId),
    });

    return reviews.map(toReviewWithLikes);
  }

  async getReviewsWithLikesByCourseId(
    courseId: number,
    userId?: number,
  ): Promise<ReviewWithLikes[]> {
    const reviews = await this.prisma.review.findMany({
      where: {
        lecture: {
          courseId,
        },
        isDeleted: false,
      },
      select: reviewWithLikeSelect(userId),
    });

    return reviews.map(toReviewWithLikes);
  }

  async getReviewsWithLikesByUserId(
    userId: number,
  ): Promise<ReviewWithLikes[]> {
    const reviews = await this.prisma.review.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      select: reviewWithLikeSelect(userId),
    });

    return reviews.map(toReviewWithLikes);
  }

  async getReviewsWithLikesLikedByUser(
    userId: number,
  ): Promise<ReviewWithLikes[]> {
    const reviews = await this.prisma.review.findMany({
      where: {
        likedUsers: {
          some: {
            id: userId,
          },
        },
        isDeleted: false,
      },
      select: reviewWithLikeSelect(userId),
    });

    return reviews.map(toReviewWithLikes);
  }

  async likeReview(
    reviewId: number,
    userId: number,
  ): Promise<ReviewWithLikes> {
    const review = await this.prisma.review.update({
      where: {
        id: reviewId,
        isDeleted: false,
      },
      data: {
        likedUsers: {
          connect: {
            id: userId,
          },
        },
      },
      select: reviewWithLikeSelect(userId),
    });

    return toReviewWithLikes(review);
  }

  async unlikeReview(
    reviewId: number,
    userId: number,
  ): Promise<ReviewWithLikes> {
    const review = await this.prisma.review.update({
      where: {
        id: reviewId,
        isDeleted: false,
      },
      data: {
        likedUsers: {
          disconnect: {
            id: userId,
          },
        },
      },
      select: reviewWithLikeSelect(userId),
    });

    return toReviewWithLikes(review);
  }

  async deleteReview(id: number): Promise<Review> {
    return this.prisma.review.update({
      where: {
        id,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}