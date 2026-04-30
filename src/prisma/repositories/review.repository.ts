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
});

// TODO: toReviewWithLikes 제네릭 함수를 구현하세요.
// 힌트: liked 필드를 추가하고 _count를 정규화합니다.
function toReviewWithLikes<
  T extends (Review & { likedUsers?: { id: number }[]; _count: { likedUsers: number } }) | null,
>(review: T): T extends null ? ReviewWithLikes | null : ReviewWithLikes {
  if (!review) return null as T extends null ? null : ReviewWithLikes;
  // TODO: liked와 _count를 추가한 객체를 반환하세요.
  return { ...review } as any;
}

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) { }

  async checkUserReviewExistsForLecture(userId: number, lectureId: number): Promise<boolean> {
    // TODO: 사용자가 해당 강의에 리뷰를 작성했는지 확인하세요.
    return false;
  }

  async createReview(data: ReviewCreateInput): Promise<Review> {
    // TODO: 리뷰를 생성하세요. FK 제약 조건 에러를 처리하세요.
    return {} as any;
  }

  async updateReview(id: number, data: ReviewUpdateInput): Promise<Review> {
    // TODO: content, grade, load, speech만 업데이트하세요. isDeleted: false인 것만.
    return {} as any;
  }

  async getReviewById(id: number): Promise<Review | null> {
    // TODO: ID로 리뷰를 조회하세요. isDeleted: false 조건 포함.
    return null;
  }

  async getReviewWithLikesById(id: number, userId?: number): Promise<ReviewWithLikes | null> {
    // TODO: 좋아요 정보 포함 리뷰 조회. toReviewWithLikes 활용.
    return null;
  }

  async getReviewsWithLikesByLectureId(lectureId: number, userId?: number): Promise<ReviewWithLikes[]> {
    // TODO: 강의별 리뷰 목록 조회. findMany + map(toReviewWithLikes).
    return [];
  }

  async getReviewsWithLikesByCourseId(courseId: number, userId?: number): Promise<ReviewWithLikes[]> {
    // TODO: 과목별 리뷰 목록 조회. lecture: { courseId }로 관계 필터링.
    return [];
  }

  async getReviewsWithLikesByUserId(userId: number): Promise<ReviewWithLikes[]> {
    // TODO: 사용자별 리뷰 목록 조회.
    return [];
  }

  async getReviewsWithLikesLikedByUser(userId: number): Promise<ReviewWithLikes[]> {
    // TODO: 사용자가 좋아요한 리뷰 목록. likedUsers: { some: { id: userId } }.
    return [];
  }

  async likeReview(reviewId: number, userId: number): Promise<ReviewWithLikes> {
    // TODO: M:N 관계에서 connect로 좋아요 연결.
    return {} as any;
  }

  async unlikeReview(reviewId: number, userId: number): Promise<ReviewWithLikes> {
    // TODO: M:N 관계에서 disconnect로 좋아요 해제.
    return {} as any;
  }

  async deleteReview(id: number): Promise<Review> {
    // TODO: 소프트 딜리트 - isDeleted: true로 업데이트.
    return {} as any;
  }
}
