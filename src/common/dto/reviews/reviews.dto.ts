import { Review } from '@prisma/client';
import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { ReviewWithLikes } from 'src/prisma/repositories/repository.dto';

export class ReviewDataDTO {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @Min(1)
  @Max(5)
  grade: number;

  @IsInt()
  @Min(1)
  @Max(5)
  load: number;

  @IsInt()
  @Min(1)
  @Max(5)
  speech: number;
}

export class ReviewCreateBodyDTO extends ReviewDataDTO { }
export class ReviewUpdateBodyDTO extends ReviewDataDTO { }

export type CreateReviewDTO = {
  userId: number;
  lectureId: number;
  content: string;
  grade: number;
  load: number;
  speech: number;
};

export type UpdateReviewDTO = {
  id: number;
  userId: number;
  lectureId: number;
  content: string;
  grade: number;
  load: number;
  speech: number;
};

export type ReviewDTO = {
  id: number;
  lectureId: number;
  content: string;
  grade: number;
  load: number;
  speech: number;
  mine: boolean;
};

// ===========================================================================
// TODO 25: ReviewDTO 변환 함수 구현하기
// ===========================================================================
// 리뷰 엔티티를 API 응답용 DTO로 변환하는 함수들입니다.
//
// (1) toReviewDTO - 커링 함수 (클로저)
//     사용법: toReviewDTO(currentUserId)(review)
//     - currentUserId를 받아 함수를 반환하는 커링 패턴
//     - 반환된 함수는 Review를 ReviewDTO로 변환
//     - mine: review.userId === currentUserId
//     - id, lectureId, content, grade, load, speech 추출
//
// (2) toReviewWithLikesDTO - 커링 함수 (클로저)
//     사용법: toReviewWithLikesDTO(currentUserId)(review)
//     - 내부에서 toReviewDTO를 사용하여 기본 DTO를 생성
//     - likes: review._count.likedUsers (Number)
//     - myLike: review.liked (Boolean)
//     - 스프레드로 기본 ReviewDTO에 likes, myLike 추가
//
// 힌트: 커링은 외부 함수가 인자를 받아 내부 함수를 반환하는 패턴입니다.
//       const fn = (userId) => (review) => ({ ... })
// ===========================================================================

export const toReviewDTO =
  (currentUserId?: number) =>
    (review: Review): ReviewDTO => ({
      // TODO: Review에서 필요한 필드를 추출하고 mine 계산하세요.
      id: review.id,
      lectureId: review.lectureId,
      content: review.content,
      grade: review.grade,
      load: review.load,
      speech: review.speech,
      mine: false,           // TODO: currentUserId와 비교
    });

export type ReviewWithLikesDTO = ReviewDTO & { likes: number, myLike: boolean };

export const toReviewWithLikesDTO = (currentUserId?: number) => {
  const toReview = toReviewDTO(currentUserId);
  return (review: ReviewWithLikes): ReviewWithLikesDTO => ({
    // TODO: toReview를 스프레드하고 likes와 myLike를 추가하세요.
    ...toReview(review),
    likes: 0,              // TODO: review._count.likedUsers
    myLike: false,         // TODO: review.liked
  });
};
