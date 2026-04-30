import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length } from 'class-validator';

import {
  CourseWithDept,
  CourseWithDeptAndLastSeenReview,
  CourseWithIncludes,
} from 'src/prisma/repositories/repository.dto';
import { LectureWithProfessorResponseDTO, toLectureWithProfessorResponseDTO } from '../lectures/lectures.dto';
import { DepartmentDTO, toDepartmentDTO } from '../departments/departments.dto';

export type CourseResponseDTO = {
  id: number;
  nameKo: string;
  nameEn: string;
  courseCode: string;
  courseNumCode: number;
  lectureTime: number;
  labTime: number;
  credit: number;
  department: DepartmentDTO;
  grade: number;
  load: number;
  speech: number;
};

// ===========================================================================
// TODO 24: CourseDTO 변환 함수 구현하기
// ===========================================================================
// 이 파일에는 Course 엔티티를 API 응답용 DTO로 변환하는 함수들이 있습니다.
//
// (1) courseWithDeptToCourseDTO(course: CourseWithDept): CourseResponseDTO
//     - course에서 필요한 필드를 추출하여 CourseResponseDTO를 만듭니다
//     - courseCode: `${course.department.deptCode}${course.courseNumCode}` 형식
//     - department: toDepartmentDTO(course.department)
//     - grade, load, speech 평균 계산:
//       course.reviewCount가 0이 아니면 sumGrade/reviewCount, 아니면 0
//
// (2) toCourseWithUnseenReviewDTO(course: CourseWithDeptAndLastSeenReview)
//     - courseWithDeptToCourseDTO를 스프레드하고
//     - unseenReview 계산:
//       (course.lastReviewId ?? 0) > (course.userLastSeenReviewOnCourse?.[0]?.lastSeenReviewId ?? 0)
//
// (3) toCourseWithLecturesDTO(course: CourseWithIncludes)
//     - courseWithDeptToCourseDTO를 스프레드하고
//     - lectures: course.lectures.map(toLectureWithProfessorResponseDTO)
//
// 힌트: 스프레드 문법(...)으로 기본 DTO를 확장합니다.
//       평균 계산 시 0으로 나누는 것을 방지하세요.
// ===========================================================================

export function courseWithDeptToCourseDTO(course: CourseWithDept): CourseResponseDTO {
  // TODO: CourseWithDept를 CourseResponseDTO로 변환하세요.
  // courseCode = deptCode + courseNumCode, grade/load/speech = sum / reviewCount (0으로 나누기 방지)
  return {
    id: course.id,
    nameKo: course.nameKo,
    nameEn: course.nameEn,
    courseCode: '',        // TODO
    courseNumCode: course.courseNumCode,
    lectureTime: course.lectureTime,
    labTime: course.labTime,
    credit: course.credit,
    department: {} as any, // TODO
    grade: 0,              // TODO
    load: 0,               // TODO
    speech: 0,             // TODO
  };
}

export type CourseWithUnseenReviewResponseDTO = CourseResponseDTO & { unseenReview: boolean };
export function toCourseWithUnseenReviewDTO(
  course: CourseWithDeptAndLastSeenReview,
): CourseWithUnseenReviewResponseDTO {
  // TODO: 안 읽은 리뷰가 있는지 계산하여 반환하세요.
  return {
    ...courseWithDeptToCourseDTO(course),
    unseenReview: false,   // TODO
  };
}

export type CourseWithLecturesResponseDTO = CourseResponseDTO & { lectures: LectureWithProfessorResponseDTO[] };

export function toCourseWithLecturesDTO(course: CourseWithIncludes): CourseWithLecturesResponseDTO {
  // TODO: 강의 목록을 포함하여 변환하세요.
  return {
    ...courseWithDeptToCourseDTO(course),
    lectures: [],          // TODO
  };
}

export class CourseFindQueryDTO {
  @IsOptional()
  @Transform(({ value }) => value.split(',').map((s) => parseInt(s)))
  @IsInt({ each: true })
  readonly departments?: number[];

  @IsOptional()
  @Transform(({ value }) => value.split(',').map((s) => parseInt(s)))
  @IsInt({ each: true })
  readonly codePrefixes?: number[];

  @IsOptional()
  @IsString()
  @Length(1, 100)
  readonly keyword?: string;
}
