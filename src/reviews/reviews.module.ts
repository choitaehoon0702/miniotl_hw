import { Module, forwardRef } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReviewsController } from './reviews.controller';
import { ReportsService } from './report.service';
import { CoursesModule } from 'src/courses/courses.module';
import { LecturesModule } from 'src/lectures/lectures.module';

// =============================================================================
// TODO 1: NestJS Module 설정하기
// =============================================================================
// 이 파일은 ReviewsModule의 모듈 설정 파일입니다.
// NestJS에서 모듈(@Module)은 애플리케이션의 구조를 조직화하는 핵심 단위입니다.
//
// @Module() 데코레이터 안에 다음 4가지 속성을 올바르게 설정하세요:
//
// 1. providers: 이 모듈에서 사용할 서비스(Provider)들을 등록합니다.
//    - ReviewsService: 리뷰의 CRUD 비즈니스 로직을 담당하는 서비스
//    - ReportsService: 리뷰 신고(Report) 기능을 담당하는 서비스
//
// 2. imports: 이 모듈이 의존하는 다른 모듈들을 가져옵니다.
//    - PrismaModule: DB 접근을 위한 Prisma ORM 모듈
//    - CoursesModule: 과목 정보가 필요하지만, CoursesModule도 ReviewsModule을
//      import하므로 순환 참조(Circular Dependency)가 발생합니다.
//      이를 해결하기 위해 forwardRef(() => CoursesModule)을 사용하세요.
//    - LecturesModule: 강의 정보 접근을 위한 모듈
//
// 3. exports: 다른 모듈에서 이 모듈의 서비스를 사용할 수 있도록 내보냅니다.
//    - ReviewsService를 export하여 CoursesModule 등에서 사용할 수 있게 합니다.
//
// 4. controllers: HTTP 요청을 처리할 컨트롤러를 등록합니다.
//    - ReviewsController: /api/reviews 경로의 요청을 처리하는 컨트롤러
//
// 힌트: forwardRef는 '@nestjs/common'에서 import할 수 있습니다.
// =============================================================================
@Module({
  // TODO: 여기에 providers, imports, exports, controllers를 설정하세요.
})
export class ReviewsModule { }
