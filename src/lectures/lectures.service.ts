import { Injectable, NotFoundException } from '@nestjs/common';
import { LectureRepository } from 'src/prisma/repositories/lecture.repository';
import { LectureStatUpdateInput } from 'src/prisma/repositories/repository.dto';

@Injectable()
export class LecturesService {
  constructor(private readonly lecturesRepository: LectureRepository) { }

  // ===========================================================================
  // TODO 20: LecturesService - 강의 서비스 구현하기
  // ===========================================================================
  // LecturesService는 강의 조회 및 통계 업데이트를 담당합니다.
  //
  // 사용 가능한 의존성:
  //   - this.lecturesRepository: 강의 DB 접근 (LectureRepository)
  //
  // (1) getLectureWithClasstimesById(id)
  //     - this.lecturesRepository.getLectureWithClasstimesById(id)로 조회
  //     - 없으면 NotFoundException('Lecture not found')를 throw
  //     - 있으면 결과를 반환
  //
  // (2) updateLectureStats(data: LectureStatUpdateInput)
  //     - this.lecturesRepository.updateLectureStats(data)를 호출하여 반환
  //
  // 힌트: LectureStatUpdateInput 타입은 repository.dto.ts에서 import됩니다.
  // ===========================================================================

  async getLectureWithClasstimesById(id: number) {
    // TODO: 강의를 수업시간 포함 조회하세요. 없으면 NotFoundException을 throw하세요.
    throw new NotFoundException('Lecture not found');
  }

  async updateLectureStats(data: LectureStatUpdateInput) {
    // TODO: 강의의 통계 정보를 업데이트하세요.
  }
}
