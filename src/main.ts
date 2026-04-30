import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { requestLogMiddlware } from './requestLog.middleware';

// ===========================================================================
// TODO 27: NestJS 애플리케이션 부트스트랩 구현하기
// ===========================================================================
// NestJS 앱의 진입점입니다. bootstrap 함수에서 앱을 구성합니다.
//
// 구현 순서:
// 1. NestFactory.create(AppModule)로 앱 인스턴스 생성
// 2. app.use(cookieParser()): 쿠키 파서 미들웨어 등록 (JWT 쿠키 읽기용)
// 3. app.useGlobalPipes(new ValidationPipe({ transform: true })):
//    전역 유효성 검증 파이프 (DTO 변환 + 검증)
// 4. ConfigService에서 'LOG_REQUESTS'를 확인하여
//    'true'이면 requestLogMiddlware 등록
//    힌트: app.get(ConfigService).get('LOG_REQUESTS')
// 5. app.listen(3000)으로 서버 시작
// ===========================================================================

async function bootstrap() {
  // TODO: NestJS 앱을 생성하고 미들웨어/파이프를 설정하세요.
  const app = await NestFactory.create(AppModule);
  // TODO: cookieParser, ValidationPipe, 조건부 requestLogMiddlware를 등록하세요.
  await app.listen(3000);
}
bootstrap();
