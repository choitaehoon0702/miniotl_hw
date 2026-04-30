import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReportsService } from './report.service';
import { ReportCreateBodyDTO, toReportDTO } from 'src/common/dto/reviews/report.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';
import { toReviewWithLikesDTO } from 'src/common/dto/reviews/reviews.dto';
import { JWTUser } from 'src/common/decorators/jwtuser.decorator';

@Controller('api/reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly reportService: ReportsService,
  ) { }

  // ===========================================================================
  // TODO 17: ReviewsController - 리뷰 좋아요/신고 엔드포인트 구현하기
  // ===========================================================================
  // 이 컨트롤러는 'api/reviews' 경로에서 리뷰 좋아요/취소와 신고 기능을 처리합니다.
  // 모든 엔드포인트는 @UseGuards(JwtAuthGuard)로 JWT 인증이 필요합니다.
  //
  // 사용 가능한 서비스:
  //   - this.reviewsService.likeReview(reviewId, userId): 리뷰 좋아요
  //   - this.reviewsService.unlikeReview(reviewId, userId): 리뷰 좋아요 취소
  //   - this.reportService.createReport(data): 신고 생성
  //
  // DTO 변환:
  //   - toReviewWithLikesDTO(userId): 리뷰 + 좋아요 정보 DTO (커링 함수)
  //   - toReportDTO(report): 신고 DTO
  //
  // 구현할 엔드포인트 3개:
  //
  // (1) POST /api/reviews/:reviewId/likes
  //     - @UseGuards(JwtAuthGuard)
  //     - @JWTUser() user: JWTPayload, @Param('reviewId') reviewId: number
  //     - reviewsService.likeReview(reviewId, user.id) 호출
  //     - 결과를 toReviewWithLikesDTO(user.id)로 변환하여 반환
  //
  // (2) DELETE /api/reviews/:reviewId/likes
  //     - @UseGuards(JwtAuthGuard)
  //     - reviewsService.unlikeReview(reviewId, user.id) 호출
  //     - 결과를 toReviewWithLikesDTO(user.id)로 변환하여 반환
  //
  // (3) POST /api/reviews/:reviewId/report
  //     - @UseGuards(JwtAuthGuard)
  //     - @JWTUser() user, @Param('reviewId') reviewId, @Body() data: ReportCreateBodyDTO
  //     - reportService.createReport({ userId: user.id, reviewId, ...data }) 호출
  //     - toReportDTO(report)로 변환하여 반환
  //
  // 힌트: 커링 함수는 toReviewWithLikesDTO(user.id)(result) 형태로 호출합니다.
  // ===========================================================================

  // TODO: 여기에 likeReview, unlikeReview, createReport 엔드포인트를 구현하세요.
}
