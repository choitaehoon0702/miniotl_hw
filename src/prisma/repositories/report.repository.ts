import { Injectable } from '@nestjs/common';
import { Report } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ReportCreateInput } from './repository.dto';

@Injectable()
export class ReportRepository {
  constructor(private readonly prisma: PrismaService) { }

  // ===========================================================================
  // TODO 22b: ReportRepository - 신고 Prisma 쿼리 구현하기
  // ===========================================================================
  //
  // (1) create(data: ReportCreateInput): Promise<Report>
  //     - prisma.report.create({ data: { userId, reviewId, content } })
  //
  // (2) checkReportExistsForReview(reviewId): Promise<boolean>
  //     - prisma.report.findFirst({ where: { reviewId } })
  //     - 결과를 !!로 boolean 변환
  // ===========================================================================

  async create(data: ReportCreateInput): Promise<Report> {
    return this.prisma.report.create({
      data: {
        userId: data.userId,
        reviewId: data.reviewId,
        content: data.content,
      },
    });
  }

  async checkReportExistsForReview(reviewId: number): Promise<boolean> {
    const report = await this.prisma.report.findFirst({
      where: {
        reviewId,
      },
    });

    return !!report;
  }
}
