import { CourseResponseDTO, courseWithDeptToCourseDTO } from '../courses/courses.dto';
import { SimpleProfessorResponseDTO, toSimpleProfessorResponseDTO } from '../professors/professors.dto';
import { ClassTimeResponseDTO, toClassTimeResponseDTO } from './classtime.dto';
import {
  LectureWithCourseProfessorClasstime,
  LectureWithProfessorClassTimes,
} from 'src/prisma/repositories/repository.dto';

export type LectureWithProfessorResponseDTO = {
  id: number;
  courseId: number;
  year: number;
  season: number;
  professor: SimpleProfessorResponseDTO;
  grade: number;
  load: number;
  speech: number;
  classTimes: ClassTimeResponseDTO[];
};

// ===========================================================================
// TODO 26: LectureDTO 변환 함수 구현하기
// ===========================================================================
// 강의 엔티티를 API 응답용 DTO로 변환하는 함수들입니다.
//
// (1) toLectureWithProfessorResponseDTO(course: LectureWithProfessorClassTimes)
//     - id, courseId, year, season 추출
//     - professor: toSimpleProfessorResponseDTO(course.professor)
//     - grade/load/speech: reviewCount가 0이 아니면 sum/count, 아니면 0
//     - classTimes: course.classTimes.map(toClassTimeResponseDTO)
//
// (2) toTimetableLectureItemDTO(lecture: LectureWithCourseProfessorClasstime)
//     - id 추출
//     - course: courseWithDeptToCourseDTO(lecture.course)
//     - professor: toSimpleProfessorResponseDTO(lecture.professor)
//     - grade/load/speech: 평균 계산 (위와 동일)
//     - classTimes: lecture.classTimes.map(toClassTimeResponseDTO)
//
// 힌트:
//   - 두 함수 모두 평균 계산 로직이 동일합니다 (0으로 나누기 방지)
//   - toDepartmentDTO, toSimpleProfessorResponseDTO, toClassTimeResponseDTO 함수 활용
//   - courseWithDeptToCourseDTO는 courses.dto.ts에서 import
// ===========================================================================

export function toLectureWithProfessorResponseDTO(
  course: LectureWithProfessorClassTimes,
): LectureWithProfessorResponseDTO {
  // TODO: 강의 + 교수 + 수업시간 정보를 DTO로 변환하세요.
  return {
    id: course.id,
    courseId: course.courseId,
    year: course.year,
    season: course.season,
    professor: {} as any,  // TODO: toSimpleProfessorResponseDTO
    grade: 0,              // TODO: 평균 계산
    load: 0,               // TODO
    speech: 0,             // TODO
    classTimes: [],        // TODO: map(toClassTimeResponseDTO)
  };
}

export type TimetableLectureItemDTO = {
  id: number;
  course: CourseResponseDTO;
  professor: SimpleProfessorResponseDTO;
  grade: number;
  load: number;
  speech: number;
  classTimes: ClassTimeResponseDTO[];
};

export function toTimetableLectureItemDTO(lecture: LectureWithCourseProfessorClasstime): TimetableLectureItemDTO {
  // TODO: 시간표용 강의 아이템 DTO로 변환하세요.
  return {
    id: lecture.id,
    course: {} as any,     // TODO: courseWithDeptToCourseDTO
    professor: {} as any,  // TODO: toSimpleProfessorResponseDTO
    grade: 0,              // TODO: 평균 계산
    load: 0,               // TODO
    speech: 0,             // TODO
    classTimes: [],        // TODO: map(toClassTimeResponseDTO)
  };
}
