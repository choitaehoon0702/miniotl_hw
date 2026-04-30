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

  async getLectureWithClasstimesById(
    id: number,
  ): Promise<LecturewithClassTimes | null> {
    return this.prisma.lecture.findUnique({
      where: {
        id,
      },
      include: {
        classTimes: true,
      },
    });
  }

  async updateLectureStats(data: LectureStatUpdateInput) {
    return this.prisma.lecture.update({
      where: {
        id: data.lectureId,
      },
      data: {
        sumGrade: {
          increment: data.gradeChange,
        },
        sumLoad: {
          increment: data.loadChange,
        },
        sumSpeech: {
          increment: data.speechChange,
        },
        reviewCount: {
          increment: data.reviewCountChange,
        },
      },
    });
  }
}
