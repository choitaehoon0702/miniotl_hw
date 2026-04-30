import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from '@prisma/client';

type LocalAuthUser = User;

// =============================================================================
// TODO 9: Local Strategy - Passport Local 인증 전략 구현하기
// =============================================================================
// PassportStrategy를 상속하여 이메일/비밀번호 기반 로컬 인증 전략을 구현합니다.
// 이 전략은 POST /api/auth/login에서 LocalAuthGuard를 통해 사용됩니다.
//
// 구현 순서:
//
// 1. 클래스 선언:
//    - PassportStrategy(Strategy, 'local')을 상속합니다
//      (두 번째 인자 'local'은 이 전략의 이름입니다)
//    - @Injectable() 데코레이터를 붙입니다
//
// 2. constructor:
//    - private authService: AuthService를 주입받습니다
//    - super({ usernameField: 'email' })을 호출합니다
//      → Passport는 기본적으로 'username' 필드를 사용하지만,
//        이 앱에서는 'email' 필드를 사용하므로 설정을 변경합니다
//
// 3. validate(email: string, password: string) 메서드:
//    - Passport가 req.body에서 email과 password를 추출하여 전달합니다
//    - this.authService.validateUser(email, password)를 호출합니다
//    - 반환값이 null이면 UnauthorizedException('Invalid credentials')을 throw합니다
//    - 성공하면 user 객체를 반환합니다 (이 값이 req.user에 저장됩니다)
//    - 반환 타입: Promise<LocalAuthUser> (즉, Promise<User>)
//
// 힌트: Strategy는 'passport-local'에서 import합니다.
//       UnauthorizedException은 '@nestjs/common'에서 import합니다.
// =============================================================================
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    // TODO: super()를 호출하여 username 필드 설정을 전달하세요.
    super({});
  }

  async validate(email: string, password: string): Promise<LocalAuthUser> {
    // TODO: 이메일/비밀번호로 사용자를 검증하고 결과를 반환하세요.
    throw new UnauthorizedException('Invalid credentials');
  }
}
