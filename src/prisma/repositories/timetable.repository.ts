import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TimetableCreateInput, TimetableWithFullLectures, TimetableWithLectureTimes } from './repository.dto';

// ===========================================================================
// TODO 23: TimetableRepository - 시간표 Prisma 쿼리 구현하기
// ===========================================================================
// TimetableRepository는 시간표 CRUD 및 강의 연결/제거를 담당합니다.
//
// === 상수 정의 ===
// TIMETABLE_WITH_FULL_LECTURES_INCLUDE: 시간표 조회 시 강의 정보를 전부 포함하는 include 객체
//   { lectures: { include: {
//       course: { include: { department: true } },
//       professor: true,
//       classTimes: true
//   } } } as const
//
// === 메서드들 ===
//
// (1) create(data: TimetableCreateInput)
//     - prisma.timetable.create({ data })
//
// (2) getTimetableWithLectureTimesById(id): Promise<TimetableWithLectureTimes | null>
//     - prisma.timetable.findUnique({ where: { id },
//       include: { lectures: { include: { classTimes: true } } } })
//
// (3) getTimetableWithLecturesById(id): Promise<TimetableWithFullLectures | null>
//     - prisma.timetable.findUnique({ where: { id },
//       include: TIMETABLE_WITH_FULL_LECTURES_INCLUDE })
//
// (4) getUserTimetablesWithLectures(userId): Promise<TimetableWithFullLectures[]>
//     - prisma.timetable.findMany({ where: { userId },
//       include: TIMETABLE_WITH_FULL_LECTURES_INCLUDE })
//
// (5) addLectureToTimetable(timetableId, lectureId): Promise<TimetableWithFullLectures>
//     - prisma.timetable.update({ where: { id: timetableId },
//       data: { lectures: { connect: { id: lectureId } } },
//       include: TIMETABLE_WITH_FULL_LECTURES_INCLUDE })
//     힌트: M:N 연결에 connect 사용
//
// (6) removeLectureFromTimetable(timetableId, lectureId): Promise<TimetableWithFullLectures>
//     - connect 대신 disconnect 사용
// ===========================================================================

// TODO: TIMETABLE_WITH_FULL_LECTURES_INCLUDE 상수를 정의하세요.
// 힌트: lectures의 course(+department), professor, classTimes를 모두 include합니다.
const TIMETABLE_WITH_FULL_LECTURES_INCLUDE = {} as const;

@Injectable()
export class TimetableRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: TimetableCreateInput) {
    // TODO: 시간표를 생성하세요.
    return {} as any;
  }

  async getTimetableWithLectureTimesById(id: number): Promise<TimetableWithLectureTimes | null> {
    // TODO: classTimes를 포함하여 시간표를 조회하세요.
    return null;
  }

  async getTimetableWithLecturesById(id: number): Promise<TimetableWithFullLectures | null> {
    // TODO: 전체 강의 정보를 포함하여 시간표를 조회하세요.
    return null;
  }

  async getUserTimetablesWithLectures(userId: number): Promise<TimetableWithFullLectures[]> {
    // TODO: 사용자의 모든 시간표를 조회하세요.
    return [];
  }

  async addLectureToTimetable(timetableId: number, lectureId: number): Promise<TimetableWithFullLectures> {
    // TODO: M:N 관계에서 connect로 강의를 시간표에 추가하세요.
    return {} as any;
  }

  async removeLectureFromTimetable(timetableId: number, lectureId: number): Promise<TimetableWithFullLectures> {
    // TODO: M:N 관계에서 disconnect로 강의를 시간표에서 제거하세요.
    return {} as any;
  }
}
