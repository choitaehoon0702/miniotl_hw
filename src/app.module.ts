import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { ReviewsModule } from './reviews/reviews.module';
import { LecturesModule } from './lectures/lectures.module';
import { SemestersModule } from './semesters/semesters.module';
import { TimetablesModule } from './timetables/timetables.module';

// ===========================================================================
// TODO 28: AppModule 루트 모듈 구성하기
// ===========================================================================
// NestJS 애플리케이션의 루트 모듈입니다.
// 모든 도메인 모듈을 imports 배열에 등록합니다.
//
// imports 배열에 포함할 모듈:
//   - ConfigModule.forRoot({ isGlobal: true }): 환경변수 관리 (전역)
//   - UsersModule, AuthModule, CoursesModule, ReviewsModule,
//     LecturesModule, SemestersModule, TimetablesModule
//
// controllers: [AppController]
// providers: [AppService]
//
// 힌트: ConfigModule.forRoot의 isGlobal: true는 모든 모듈에서
//       ConfigService를 주입받을 수 있게 합니다.
// ===========================================================================

@Module({
  // TODO: imports, controllers, providers를 설정하세요.
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
