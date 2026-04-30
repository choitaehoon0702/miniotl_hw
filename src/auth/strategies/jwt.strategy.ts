import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWTPayload } from 'src/common/dto/auth/auth.dto';
import { UsersService } from 'src/users/users.service';


// =============================================================================
// TODO 8: JWT Strategy - Passport JWT 인증 전략 구현하기
// =============================================================================
// PassportStrategy를 상속하여 JWT 토큰 기반 인증 전략을 구현합니다.
// 이 전략은 HTTP 요청의 쿠키에서 JWT 토큰을 추출하고 검증합니다.
//
// 구현 순서:
//
// 1. 클래스 선언:
//    - PassportStrategy(Strategy)를 상속합니다
//      (Strategy는 'passport-jwt'에서 import)
//    - @Injectable() 데코레이터를 붙입니다
//
// 2. constructor에서 super()를 호출합니다.
//    super() 인자 (설정 객체):
//    {
//      jwtFromRequest: ExtractJwt.fromExtractors([(request) => request?.cookies?.jwt]),
//        → 쿠키의 'jwt' 필드에서 토큰을 추출합니다
//      ignoreExpiration: false,
//        → 만료된 토큰은 거부합니다
//      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
//        → 환경 변수에서 JWT 서명 검증에 사용할 시크릿 키를 가져옵니다
//    }
//
//    constructor 파라미터:
//    - private readonly configService: ConfigService
//    - private readonly usersService: UsersService
//
// 3. validate(payload: JWTPayload) 메서드:
//    - Passport가 JWT 토큰을 성공적으로 검증한 후 호출됩니다
//    - payload를 그대로 반환합니다 (이 값이 request.user에 저장됩니다)
//
// 힌트: PassportStrategy(Strategy)에서 Strategy는 passport-jwt의 Strategy입니다.
//       ExtractJwt는 passport-jwt에서 import합니다.
//       ConfigService는 @nestjs/config에서 import합니다.
// =============================================================================
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    // TODO: super()를 호출하여 JWT 추출/검증 설정을 전달하세요.
    super({});
  }

  async validate(payload: JWTPayload) {
    // TODO: 검증된 payload를 반환하세요.
    return null;
  }
}
