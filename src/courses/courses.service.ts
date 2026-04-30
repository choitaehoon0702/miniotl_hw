import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseFindFilter, CourseRepository } from 'src/prisma/repositories/course.repository';
import { CourseStatUpdateInput } from 'src/prisma/repositories/repository.dto';
import { UserLastSeenReviewOnCourseRepository } from 'src/prisma/repositories/userLastSeenReviewOnCourse.repository';

@Injectable()
export class CoursesService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly userLastSeenReviewOnCourseRepository: UserLastSeenReviewOnCourseRepository,
  ) { }

  // ===========================================================================
  // TODO 15: CoursesService - 과목 서비스 구현하기
  // ===========================================================================
  // CoursesService는 과목 관련 비즈니스 로직을 담당합니다.
  //
  // 사용 가능한 의존성:
  //   - this.courseRepository: 과목 DB 접근 (CourseRepository)
  //   - this.userLastSeenReviewOnCourseRepository: 리뷰 확인 정보 DB 접근
  //
  // 아래 5개의 메서드를 구현하세요:
  //
  // (1) getCourseWithLectures(id)
  //     - this.courseRepository.getCourseWithLectures(id)를 호출하여 반환합니다
  //
  // (2) findFiltered(filter, userId?)
  //     - this.courseRepository.findFiltered(filter, userId)를 호출하여 반환합니다
  //
  // (3) updateCourseStats(data: CourseStatUpdateInput)
  //     - this.courseRepository.updateCourseStats(data)를 호출하여 반환합니다
  //
  // (4) updateCourseLastReviewId(courseId)
  //     - this.courseRepository.updateLastReviewId(courseId)를 호출하여 반환합니다
  //
  // (5) userSawReviewOnCourse(courseId, userId)
  //     - 먼저 this.courseRepository.getCoursebyId(courseId)로 과목을 조회합니다
  //     - 과목이 없으면 NotFoundException('Course not found')를 throw합니다
  //     - course.lastReviewId가 null이면 return (리뷰가 없으므로 처리 불필요)
  //     - this.userLastSeenReviewOnCourseRepository.sawReviewOnCourse({
  //         courseId, userId, lastSeenReviewId: course.lastReviewId
  //       })를 호출하여 반환합니다
  //
  // 힌트: CourseFindFilter 타입은 course.repository.ts에서 import됩니다.
  //       CourseStatUpdateInput은 repository.dto.ts에서 import됩니다.
  // ===========================================================================

  async getCourseWithLectures(id: number) {
    // TODO: 과목을 강의 포함 조회하여 반환하세요.
    return null;
  }

  async findFiltered(filter: CourseFindFilter, userId?: number) {
    // TODO: 필터 조건으로 과목을 검색하여 반환하세요.
    return [];
  }

  async updateCourseStats(data: CourseStatUpdateInput) {
    // TODO: 과목의 통계 정보를 업데이트하세요.
  }

  async updateCourseLastReviewId(courseId: number) {
    // TODO: 과목의 마지막 리뷰 ID를 업데이트하세요.
  }

  async userSawReviewOnCourse(courseId: number, userId: number) {
    // TODO: 사용자가 과목의 리뷰를 확인했음을 기록하세요.
  }
}
