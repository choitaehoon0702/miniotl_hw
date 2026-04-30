import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LectureStatUpdateInput, LecturewithClassTimes } from './repository.dto';


@Injectable()
export class LectureRepository {
  constructor(private readonly prisma: PrismaService) { }

  // ===========================================================================
  // TODO 22c: LectureRepository - 강의 Prisma 쿼리 구현하기
  // ===========================================================================
  //
  // (1) getLectureWithClasstimesById(id): Promise<LecturewithClassTimes | null>
  //     - prisma.lecture.findUnique({ where: { id }, include: { classTimes: true } })
  //
  // (2) updateLectureStats(data: LectureStatUpdateInput)
  //     - prisma.lecture.update({
  //         where: { id: data.lectureId },
  //         data: {
  //           sumGrade: { increment: data.gradeChange },
  //           sumLoad: { increment: data.loadChange },
  //           sumSpeech: { increment: data.speechChange },
  //           reviewCount: { increment: data.reviewCountChange },
  //         }
  //       })
  //     힌트: Prisma의 { increment: value } 사용법을 익혀두세요.
  // ===========================================================================

  async getLectureWithClasstimesById(id: number): Promise<LecturewithClassTimes | null> {
    // TODO: Prisma로 강의를 classTimes include하여 조회하세요.
    return null;
  }

  async updateLectureStats(data: LectureStatUpdateInput) {
    // TODO: Prisma의 increment를 사용하여 통계를 업데이트하세요.
    return {} as any;
  }
}
