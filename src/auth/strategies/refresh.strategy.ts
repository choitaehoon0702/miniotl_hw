import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { JWTPayload } from 'src/common/dto/auth/auth.dto';
import { AuthService } from '../auth.service';

// =============================================================================
// TODO 10: Refresh Strategy - Passport Refresh Token 전략 구현하기
// =============================================================================
// JWT Access 토큰이 만료되었을 때 Refresh 토큰으로 새 Access 토큰을 발급합니다.
// JwtAuthGuard가 ['jwt', 'refresh'] 두 전략을 순서대로 시도하므로,
// jwt 전략 실패 시 이 refresh 전략이 시도됩니다.
//
// 구현 순서:
//
// 1. 클래스 선언:
//    - PassportStrategy(Strategy, 'refresh')를 상속합니다
//      (Strategy는 'passport-jwt'의 Strategy)
//    - @Injectable() 데코레이터를 붙입니다
//
// 2. constructor에서 super()를 호출합니다.
//    super() 인자:
//    {
//      jwtFromRequest: ExtractJwt.fromExtractors([(request) => request?.cookies?.refresh]),
//        → 쿠키의 'refresh' 필드에서 Refresh 토큰을 추출
//      ignoreExpiration: false,
//        → 만료된 Refresh 토큰은 거부
//      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
//        → Refresh 토큰 전용 시크릿 키
//      passReqToCallback: true,
//        → validate 메서드에 Request 객체를 첫 번째 인자로 전달
//    }
//
// 3. validate(request: Request, payload: JWTPayload) 메서드:
//    - passReqToCallback: true이므로 첫 번째 인자가 Request 객체입니다
//    - this.authService.validateRefreshAndGenerateAccessToken(
//        payload.id, request.cookies.refresh
//      )을 호출하여 반환합니다
//    - 이 메서드는 DB의 Refresh 토큰과 비교 후 새 Access 토큰을 생성합니다
//
// 힌트: Request는 'express'에서 import합니다.
//       cookies.refresh로 쿠키에서 Refresh 토큰 원본 문자열에 접근합니다.
// =============================================================================
@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    // TODO: super()를 호출하여 Refresh 토큰 추출/검증 설정을 전달하세요.
    super({});
  }

  async validate(request: Request, payload: JWTPayload) {
    // TODO: Refresh 토큰을 검증하고 새 Access 토큰을 생성하여 반환하세요.
    return null;
  }
}
