import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ClassTime } from '@prisma/client';
import { CreateTimetableDTO } from 'src/common/dto/timetables/timetables.dto';
import { LecturesService } from 'src/lectures/lectures.service';
import { LecturewithClassTimes, TimetableWithLectureTimes } from 'src/prisma/repositories/repository.dto';
import { TimetableRepository } from 'src/prisma/repositories/timetable.repository';

@Injectable()
export class TimetablesService {
  constructor(
    private readonly timetableRepository: TimetableRepository,
    private readonly lecturesService: LecturesService,
  ) { }

  async createTimetableForUser(data: CreateTimetableDTO) {
    return this.timetableRepository.create(data);
  }

  async getUserTimetablesWithLectures(userId: number) {
    return this.timetableRepository.getUserTimetablesWithLectures(userId);
  }

  async getUserTimetableWithLectureById(userId: number, timetableId: number) {
    const result = await this.timetableRepository.getTimetableWithLecturesById(timetableId);
    if (!result || result.userId != userId) throw new NotFoundException('Timetable not found');
    return result;
  }

  // ===========================================================================
  // TODO 4: Service의 비즈니스 로직 구현하기
  // ===========================================================================
  // NestJS의 Service는 비즈니스 로직을 캡슐화하는 계층입니다.
  // Controller에서 호출되며, Repository를 통해 데이터에 접근합니다.
  //
  // 아래 3개의 메서드를 구현하세요:
  //
  // (1) addLectureToTimetableForUser(userId, timetableId, lectureId)
  //     시간표에 강의를 추가하는 핵심 비즈니스 로직입니다.
  //
  //     순서:
  //     a. 시간표와 강의 정보를 동시에 조회합니다 (Promise.all 활용).
  //        - this.timetableRepository.getTimetableWithLectureTimesById(timetableId)
  //        - this.lecturesService.getLectureWithClasstimesById(lectureId)
  //
  //     b. 다음 4가지 유효성 검사를 수행합니다:
  //        - 시간표가 존재하지 않거나 해당 유저의 시간표가 아닌 경우
  //          → NotFoundException('Timetable not found')
  //        - 강의의 학기(year, season)와 시간표의 학기가 다른 경우
  //          → BadRequestException('Can only add lectures on same semester to timetable')
  //        - 이미 시간표에 같은 강의가 있는 경우 (timetable.lectures 배열에서 id 비교)
  //          → BadRequestException('Lecture already in timetable')
  //        - 시간이 겹치는 강의가 있는 경우 (checkLectureTimeConflict 메서드 활용)
  //          → BadRequestException('Lecture time conflict')
  //
  //     c. 모든 검증 통과 시: this.timetableRepository.addLectureToTimetable(timetableId, lectureId) 반환
  //
  // (2) checkLectureTimeConflict(lecture, timetable) - private 메서드
  //     추가하려는 강의의 수업 시간이 시간표의 기존 강의들과 겹치는지 확인합니다.
  //     - lecture.classTimes의 각 시간을
  //     - timetable.lectures의 각 강의의 classTimes와 비교합니다.
  //     - 하나라도 겹치면 true, 아니면 false를 반환합니다.
  //     - 겹침 판단은 checkClasstimeOverlap 메서드를 사용합니다.
  //
  // (3) checkClasstimeOverlap(a, b) - private 메서드
  //     두 수업 시간(ClassTime)이 겹치는지 판단합니다.
  //     - ClassTime 타입: { day: number, startTime: Date, endTime: Date, ... }
  //     - 요일(day)이 다르면 겹치지 않습니다 (false)
  //     - 같은 요일이면: a.startTime < b.endTime && a.endTime > b.startTime 이면 겹침 (true)
  //
  // 힌트: NotFoundException, BadRequestException은 '@nestjs/common'에서 import합니다.
  //       LecturewithClassTimes, TimetableWithLectureTimes 타입은 이미 import되어 있습니다.
  // ===========================================================================
  async addLectureToTimetableForUser(userId: number, timetableId: number, lectureId: number) {
    // TODO: 여기에 시간표에 강의 추가 로직을 구현하세요.
  }

  private checkLectureTimeConflict(lecture: LecturewithClassTimes, timetable: TimetableWithLectureTimes) {
    // TODO: 여기에 시간 충돌 검사 로직을 구현하세요.
    return false;
  }

  private checkClasstimeOverlap(a: ClassTime, b: ClassTime) {
    // TODO: 여기에 두 수업 시간 겹침 판단 로직을 구현하세요.
    return false;
  }

  async removeLectureFromTimetableForUser(userId: number, timetableId: number, lectureId: number) {
    const timetable = await this.timetableRepository.getTimetableWithLectureTimesById(timetableId);
    if (!timetable || timetable.userId != userId) throw new NotFoundException('Timetable not found');
    if (!timetable.lectures.some((l) => l.id === lectureId)) throw new BadRequestException('Lecture not in timetable');

    return this.timetableRepository.removeLectureFromTimetable(timetableId, lectureId);
  }
}
