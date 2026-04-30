import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';

// =============================================================================
// TODO 11: AdminGuard - 관리자 권한 검사 Guard 구현하기
// =============================================================================
// AdminGuard는 요청한 사용자가 관리자(isAdmin)인지 확인하는 Guard입니다.
// JwtAuthGuard와 함께 사용되며, 예: @UseGuards(JwtAuthGuard, AdminGuard)
//
// CanActivate 인터페이스를 구현하며, canActivate 메서드를 정의합니다.
//
// canActivate(context: ExecutionContext) 구현:
//   1. context.switchToHttp().getRequest()로 HTTP 요청 객체를 가져옵니다
//   2. request.user에서 JWTPayload를 가져옵니다 (user가 없을 수 있으므로 optional)
//   3. user?.isAdmin이 true이면 접근 허용(true), 아니면 거부(false)
//      → !!user?.isAdmin 형태로 반환합니다
//
// 반환 타입: boolean | Promise<boolean> | Observable<boolean>
//
// 힌트: Observable는 'rxjs'에서 import합니다.
//       JWTPayload 타입은 { id: number, isAdmin: boolean }입니다.
// =============================================================================
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // TODO: 요청의 user에서 isAdmin 여부를 확인하여 반환하세요.
    return false;
  }
}
