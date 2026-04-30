import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorator/skip-auth.decorator';
import { JWTPayload, TokenRefreshPayload } from 'src/common/dto/auth/auth.dto';
import { RefreshTokenInvalidException } from '../refresh.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt', 'refresh']) implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  // ===========================================================================
  // TODO 2: Guard의 canActivate 메서드 구현하기
  // ===========================================================================
  // NestJS의 Guard는 요청이 라우트 핸들러에 도달하기 전에 인가(Authorization)를
  // 검사하는 역할을 합니다. canActivate 메서드가 true를 반환하면 요청이 허용되고,
  // false를 반환하거나 예외를 던지면 요청이 거부됩니다.
  //
  // 이 Guard는 JWT 토큰과 Refresh 토큰 두 가지 전략을 동시에 사용합니다.
  // (AuthGuard(['jwt', 'refresh']))
  //
  // 구현해야 할 로직:
  //
  // 1. @Public() 데코레이터가 붙은 라우트인지 확인합니다.
  //    - this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
  //    - Public 라우트는 인증 실패 시에도 접근을 허용해야 합니다.
  //
  // 2. try 블록에서 super.canActivate(context)를 호출하여 JWT/Refresh 인증을 시도합니다.
  //    - 인증 성공 시:
  //      a. request에서 user 정보를 가져옵니다 (JWTPayload 또는 TokenRefreshPayload 타입)
  //      b. user에 'access' 프로퍼티가 있으면 Refresh 토큰으로 인증된 것입니다.
  //         - access 토큰 정보를 분리하고 (const { access, ...newPayload } = request.user)
  //         - request.user를 새 payload로 교체합니다
  //         - response에 새 access 토큰 쿠키를 설정합니다
  //           (response.cookie('jwt', access.token, access.options))
  //      c. true를 반환합니다.
  //    - 인증 실패 시: isPublic이면 true, 아니면 false를 반환합니다.
  //
  // 3. catch 블록에서 에러를 처리합니다.
  //    - RefreshTokenInvalidException인 경우: UnauthorizedException으로 변환하여 throw
  //    - isPublic이면: true를 반환 (인증 없이도 접근 허용)
  //    - 그 외: 에러를 다시 throw
  //
  // 힌트: context.switchToHttp().getRequest() / .getResponse()로 HTTP 객체에 접근합니다.
  // ===========================================================================
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // TODO: 여기에 Guard 로직을 구현하세요.
    return false;
  }
}
