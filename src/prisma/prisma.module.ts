import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user.repository';
import { CourseRepository } from './repositories/course.repository';
import { ReviewRepository } from './repositories/review.repository';
import { ReportRepository } from './repositories/report.repository';
import { LectureRepository } from './repositories/lecture.repository';
import { TimetableRepository } from './repositories/timetable.repository';
import { UserLastSeenReviewOnCourseRepository } from './repositories/userLastSeenReviewOnCourse.repository';

// ===========================================================================
// TODO 29: PrismaModule - 데이터베이스 모듈 구성하기
// ===========================================================================
// PrismaModule은 모든 Repository와 PrismaService를
// 다른 모듈에서 사용할 수 있도록 제공합니다.
//
// providers 및 exports에 포함할 클래스:
//   - PrismaService
//   - UserRepository
//   - CourseRepository
//   - LectureRepository
//   - ReviewRepository
//   - ReportRepository
//   - TimetableRepository
//   - UserLastSeenReviewOnCourseRepository
//
// providers: 이 모듈 내에서 인스턴스화할 클래스들
// exports: 다른 모듈에서 DI로 사용할 수 있도록 내보낼 클래스들
//
// 힌트: providers와 exports 배열에 동일한 클래스를 넣습니다.
//       exports에 넣어야만 다른 모듈에서 import하여 사용할 수 있습니다.
// ===========================================================================

@Module({
  // TODO: providers와 exports 배열을 채우세요.
  providers: [],
  exports: [],
})
export class PrismaModule { }
