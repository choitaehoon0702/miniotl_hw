import {
  ConflictException,
  NotFoundException,
  ForbiddenException,
  Injectable,
  Inject,
  forwardRef,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateReviewDTO, UpdateReviewDTO } from 'src/common/dto/reviews/reviews.dto';
import { ReviewRepository } from 'src/prisma/repositories/review.repository';
import { ReportsService } from './report.service';
import { CoursesService } from 'src/courses/courses.service';
import { LecturesService } from 'src/lectures/lectures.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    @Inject(forwardRef(() => ReportsService))
    private readonly reportService: ReportsService,
    @Inject(forwardRef(() => CoursesService))
    private readonly coursesService: CoursesService,
    private readonly lecturesService: LecturesService,
  ) { }

  // ===========================================================================
  // TODO 16: ReviewsService - 리뷰 서비스 핵심 로직 구현하기
  // ===========================================================================
  // ReviewsService는 리뷰의 생성, 수정, 삭제, 좋아요 등 비즈니스 로직을 담당합니다.
  // 리뷰 작성/수정/삭제 시 과목&강의의 통계(grade, load, speech)도 함께 업데이트합니다.
  //
  // 사용 가능한 의존성:
  //   - this.reviewRepository: 리뷰 DB 접근
  //   - this.reportService: 신고 여부 확인
  //   - this.coursesService: 과목 통계 업데이트
  //   - this.lecturesService: 강의 조회 및 통계 업데이트
  //
  // 아래 메서드들을 구현하세요:
  //
  // (1) createReview(data: CreateReviewDTO)
  //     a. 이미 해당 강의에 리뷰를 작성했는지 확인:
  //        reviewRepository.checkUserReviewExistsForLecture(data.userId, data.lectureId)
  //        → 존재하면 ConflictException("User's review already exists for this lecture")
  //     b. 강의 정보를 조회: lecturesService.getLectureWithClasstimesById(data.lectureId)
  //     c. 리뷰를 생성: reviewRepository.createReview(data)
  //     d. 통계 업데이트 (try-catch로 감싸기, 실패 시 InternalServerErrorException):
  //        - changes 객체를 만듭니다:
  //          { gradeChange: data.grade, loadChange: data.load,
  //            speechChange: data.speech, reviewCountChange: 1 }
  //        - Promise.all로 동시 실행:
  //          • coursesService.updateCourseStats({ ...changes, courseId: lecture.courseId })
  //          • coursesService.updateCourseLastReviewId(lecture.courseId)
  //          • lecturesService.updateLectureStats({ ...changes, lectureId: data.lectureId })
  //     e. newReview를 반환합니다
  //
  // (2) updateReviewByUser(data: UpdateReviewDTO)
  //     a. data에서 id, userId, lectureId를 분리: const { id, userId, lectureId, ...rest } = data;
  //     b. 기존 리뷰를 조회: this.getReviewWithId(id)
  //     c. 권한 검사:
  //        - review.userId !== userId → ForbiddenException('Review can only be updated by its author')
  //        - review.lectureId !== lectureId → NotFoundException('Review not found')
  //     d. 강의 정보 조회: lecturesService.getLectureWithClasstimesById(review.lectureId)
  //     e. 리뷰 수정: reviewRepository.updateReview(id, rest)
  //     f. 변경량으로 통계 업데이트 (새값 - 이전값):
  //        { gradeChange: data.grade - review.grade, loadChange: data.load - review.load,
  //          speechChange: data.speech - review.speech, reviewCountChange: 0 }
  //        - 변경량이 있을 때만 Promise.all로:
  //          • coursesService.updateCourseStats / lecturesService.updateLectureStats
  //     g. newReview를 반환합니다
  //
  // (3) getReviewWithId(id) → Review
  //     - reviewRepository.getReviewById(id)로 조회
  //     - 없거나 isDeleted이면 NotFoundException('Review not found')
  //
  // (4) getReviewWithLikesById(id, userid?) → ReviewWithLikes | null
  //     - reviewRepository.getReviewWithLikesById(id, userid) 반환
  //
  // (5) getReviewsWithLikesByLectureId(lectureId, userId?)
  //     - reviewRepository.getReviewsWithLikesByLectureId(lectureId, userId) 반환
  //
  // (6) getReviewsWithLikesByCourseId(courseId, userId?)
  //     - reviewRepository.getReviewsWithLikesByCourseId(courseId, userId) 반환
  //
  // (7) likeReview(reviewId, userId)
  //     - getReviewWithId(reviewId)로 리뷰 존재 확인
  //     - review.userId === userId이면 ForbiddenException('User cannot like own review')
  //     - reviewRepository.likeReview(reviewId, userId) 반환
  //
  // (8) unlikeReview(reviewId, userId)
  //     - getReviewWithId(reviewId)로 리뷰 존재 확인
  //     - reviewRepository.unlikeReview(reviewId, userId) 반환
  //
  // (9) deleteReviewByAdmin(id)
  //     a. reviewRepository.getReviewById(id)로 조회
  //     b. 없으면 NotFoundException('Review not found')
  //     c. isDeleted이면 ConflictException('Review already deleted')
  //     d. 신고된 리뷰인지 확인:
  //        reportService.checkReportExistsForReview(id)
  //        → 신고 없으면 ForbiddenException('Review can only be deleted after being reported')
  //     e. 강의 정보 조회: lecturesService.getLectureWithClasstimesById(review.lectureId)
  //     f. 소프트 삭제: reviewRepository.deleteReview(id)
  //     g. 통계 업데이트 (음수 변경량):
  //        { gradeChange: -review.grade, loadChange: -review.load,
  //          speechChange: -review.speech, reviewCountChange: -1 }
  //     h. deletedReview를 반환합니다
  //
  // (10) getReviewsOfUser(userId)
  //      - reviewRepository.getReviewsWithLikesByUserId(userId) 반환
  //
  // (11) getReviewsLikedByUser(userId)
  //      - reviewRepository.getReviewsWithLikesLikedByUser(userId) 반환
  //
  // 힌트: Promise.all은 병렬 비동기 작업에 사용합니다.
  //       try-catch 내에서 통계 업데이트 실패 시 console.error하고
  //       InternalServerErrorException을 throw합니다.
  // ===========================================================================

  async createReview(data: CreateReviewDTO) {
    // TODO: 리뷰 생성 + 과목/강의 통계 업데이트 로직을 구현하세요.
    return {} as any;
  }

  async updateReviewByUser(data: UpdateReviewDTO) {
    // TODO: 리뷰 수정 + 권한 검사 + 통계 업데이트 로직을 구현하세요.
    return {} as any;
  }

  async getReviewWithId(id: number) {
    // TODO: ID로 리뷰를 조회하세요. 없거나 삭제되었으면 NotFoundException을 throw하세요.
    throw new NotFoundException('Review not found');
  }

  async getReviewWithLikesById(id: number, userid: number | undefined) {
    // TODO: 좋아요 정보 포함 리뷰를 조회하세요.
    return null;
  }

  async getReviewsWithLikesByLectureId(lectureId: number, userId: number | undefined) {
    // TODO: 강의별 리뷰 목록을 조회하세요.
    return [];
  }

  async getReviewsWithLikesByCourseId(courseId: number, userId: number | undefined) {
    // TODO: 과목별 리뷰 목록을 조회하세요.
    return [];
  }

  async likeReview(reviewId: number, userId: number) {
    // TODO: 리뷰 좋아요 로직을 구현하세요. 본인 리뷰는 좋아요 불가.
    return {} as any;
  }

  async unlikeReview(reviewId: number, userId: number) {
    // TODO: 리뷰 좋아요 취소 로직을 구현하세요.
    return {} as any;
  }

  async deleteReviewByAdmin(id: number) {
    // TODO: 관리자 리뷰 삭제 (신고된 리뷰만 삭제 가능) 로직을 구현하세요.
    return {} as any;
  }

  async getReviewsOfUser(userId: number) {
    // TODO: 사용자가 작성한 리뷰 목록을 조회하세요.
    return [];
  }

  async getReviewsLikedByUser(userId: number) {
    // TODO: 사용자가 좋아요한 리뷰 목록을 조회하세요.
    return [];
  }
}
