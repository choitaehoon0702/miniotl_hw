import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// =============================================================================
// TODO 12: 커스텀 파라미터 데코레이터 만들기
// =============================================================================
// NestJS의 createParamDecorator를 사용하여 커스텀 파라미터 데코레이터를 만듭니다.
//
// 이 데코레이터는 컨트롤러 메서드의 파라미터에 @JWTUser()를 붙이면
// JWT에서 파싱된 사용자 정보를 자동으로 주입해 줍니다.
//
// 사용 예:
//   @Get('profile')
//   getProfile(@JWTUser() user: JWTPayload) { ... }
//
// 구현:
//   createParamDecorator의 콜백 함수에서:
//   1. ctx.switchToHttp().getRequest()로 HTTP 요청 객체를 가져옵니다
//   2. request.user를 반환합니다 (Passport가 인증 후 저장한 값)
//
// 힌트: createParamDecorator((data: unknown, ctx: ExecutionContext) => { ... })
// =============================================================================
export const JWTUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  // TODO: 요청 객체에서 user 정보를 추출하여 반환하세요.
  return null;
});
