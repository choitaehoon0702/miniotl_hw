import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CourseStatUpdateInput,
  CourseWithDept,
  CourseWithDeptAndLastSeenReview,
  CourseWithIncludes,
} from './repository.dto';
import { Course } from '@prisma/client';

export type CourseFindFilter = {
  departments?: number[];
  codePrefixes?: number[];
  keyword?: string;
};

@Injectable()
export class CourseRepository {
  constructor(private readonly prisma: PrismaService) { }

  async getCourseWithLectures(id: number): Promise<CourseWithIncludes | null> {
    return await this.prisma.course.findUnique({
      where: { id },
      include: {
        department: true,
        lectures: {
          include: {
            professor: true,
            classTimes: true,
          },
        },
      },
    });
  }

  async getCoursebyId(id: number): Promise<Course | null> {
    return await this.prisma.course.findUnique({ where: { id } });
  }

  // ===========================================================================
  // TODO 5: Repository의 복합 필터 쿼리 구현하기
  // ===========================================================================
  // Repository는 데이터베이스 접근 로직을 캡슐화하는 계층입니다.
  // Prisma ORM을 사용하여 타입 안전한 쿼리를 작성합니다.
  //
  // 이 메서드는 다양한 필터 조건으로 과목(Course)을 검색합니다.
  //
  // 파라미터:
  //   - filter.departments?: number[]   → 학과 ID 배열 (departmentId가 이 중 하나인 과목)
  //   - filter.codePrefixes?: number[]  → 과목 번호 접두사 배열
  //     (예: [2, 3] → 200번대, 300번대 과목. courseNumCode가 prefix*100 이상, (prefix+1)*100 미만)
  //   - filter.keyword?: string         → 검색어 (과목 한글명 또는 영문명에 포함)
  //   - userId?: number                 → 로그인한 사용자 ID (있으면 마지막 확인 리뷰 정보 포함)
  //
  // 구현 순서:
  //
  // 1. codePrefixes 필터를 Prisma 조건으로 변환합니다.
  //    filter.codePrefixes가 있으면 각 prefix에 대해:
  //    { courseNumCode: { gte: prefix * 100, lt: (prefix + 1) * 100 } }
  //    형태의 객체 배열을 만듭니다.
  //
  // 2. this.prisma.course.findMany()를 호출합니다.
  //    - where: AND 조건으로 3가지 필터를 결합합니다.
  //      a. departments 필터: { departmentId: { in: filter.departments } }
  //         (없으면 빈 객체 {})
  //      b. codePrefixes 필터: { OR: 위에서 만든 배열 }
  //         (없으면 빈 객체 {})
  //      c. keyword 필터: { OR: [{ nameKo: { contains: keyword } }, { nameEn: { contains: keyword } }] }
  //         (없으면 빈 객체 {})
  //
  //    - include: 관계 데이터를 함께 조회합니다.
  //      a. department: true (항상 학과 정보 포함)
  //      b. userLastSeenReviewOnCourse: userId가 있으면 { where: { userId } }, 없으면 false
  //
  // 반환 타입: userId가 있으면 CourseWithDeptAndLastSeenReview[], 없으면 CourseWithDept[]
  //
  // 힌트: Prisma의 findMany, AND/OR 조건, 조건부 include를 활용하세요.
  //       삼항 연산자로 필터가 있을 때와 없을 때를 분기합니다.
  // ===========================================================================
  async findFiltered(
    filter: CourseFindFilter,
    userId?: number,
  ): Promise<CourseWithDept[] | CourseWithDeptAndLastSeenReview[]> {
    // TODO: 여기에 복합 필터 쿼리를 구현하세요.
    return [];
  }

  async updateCourseStats(data: CourseStatUpdateInput) {
    return await this.prisma.course.update({
      where: { id: data.courseId },
      data: {
        sumGrade: { increment: data.gradeChange },
        sumLoad: { increment: data.loadChange },
        sumSpeech: { increment: data.speechChange },
        reviewCount: { increment: data.reviewCountChange },
      },
    });
  }

  async updateLastReviewId(courseId: number) {
    const lastReviewId =
      (
        await this.prisma.review.findFirst({
          where: { lecture: { courseId }, isDeleted: false },
          orderBy: { id: 'desc' },
          select: { id: true },
        })
      )?.id ?? null;
    return await this.prisma.course.update({
      where: { id: courseId },
      data: { lastReviewId: lastReviewId },
    });
  }
}
