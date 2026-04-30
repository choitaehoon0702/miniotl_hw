import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { ReportCreateDTO } from 'src/common/dto/reviews/report.dto';
import { ReportRepository } from 'src/prisma/repositories/report.repository';
import { ReviewsService } from './reviews.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly reportRepository: ReportRepository,
    @Inject(forwardRef(() => ReviewsService))
    private readonly reviewsService: ReviewsService,
  ) { }

  // ===========================================================================
  // TODO 18: ReportsService - 신고 서비스 구현하기
  // ===========================================================================
  // ReportsService는 리뷰 신고 기능의 비즈니스 로직을 담당합니다.
  //
  // 사용 가능한 의존성:
  //   - this.reportRepository: 신고 DB 접근 (ReportRepository)
  //   - this.reviewsService: 리뷰 조회 (순환 참조로 @Inject(forwardRef(...)) 사용)
  //
  // (1) createReport(data: ReportCreateDTO)
  //     - this.reviewsService.getReviewWithId(data.reviewId)로 리뷰를 조회합니다
  //     - 본인 리뷰는 신고할 수 없습니다:
  //       review.userId === data.userId이면
  //       NotFoundException('User cannot report their own review') throw
  //     - this.reportRepository.create(data)를 호출하여 반환합니다
  //
  // (2) checkReportExistsForReview(reviewId)
  //     - this.reportRepository.checkReportExistsForReview(reviewId)를 호출하여 반환합니다
  //
  // 힌트: ReportCreateDTO 타입은 { userId, reviewId, content } 입니다.
  // ===========================================================================

  async createReport(data: ReportCreateDTO) {
    // TODO: 리뷰 신고 로직을 구현하세요. 본인 리뷰는 신고 불가.
    return {} as any;
  }

  async checkReportExistsForReview(reviewId: number) {
    // TODO: 리뷰에 신고가 있는지 확인하세요.
    return false;
  }
}
