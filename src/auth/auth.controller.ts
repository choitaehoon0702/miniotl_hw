import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from 'src/auth/auth.service';
import { CreateUserDTO, UserDTO, toUserDTO } from 'src/common/dto/users/users.dto';
import { LocalAuthGuard } from 'src/auth/guard/local-auth.guard';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JWTUser } from 'src/common/decorators/jwtuser.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  // ===========================================================================
  // TODO 7: AuthController - 인증 관련 엔드포인트 구현하기
  // ===========================================================================
  // 이 컨트롤러는 'api/auth' 경로에서 로그인, 회원가입, 관리자 전환을 처리합니다.
  //
  // 사용 가능한 서비스:
  //   - this.usersService.createUser(dto): 새 사용자 생성
  //   - this.usersService.toggleAdmin(userId): 관리자 권한 토글
  //   - this.usersService.updateRefreshToken(userId, token): Refresh 토큰 DB 저장
  //   - this.authService.getAccessTokenAndOptions(payload): Access 토큰 생성
  //   - this.authService.getRefreshTokenAndOptions(payload): Refresh 토큰 생성
  //
  // DTO 변환:
  //   - toUserDTO(user): User 엔티티를 UserDTO로 변환
  //
  // 구현할 엔드포인트 3개 + private 메서드 1개:
  //
  // (1) POST /api/auth/login
  //     - @UseGuards(LocalAuthGuard)로 이메일/비밀번호 검증을 Passport에 위임합니다
  //     - 검증 성공 시 req.user에 User 객체가 담겨옵니다
  //     - @Req() req: Request & { user: User }로 요청 객체를 받습니다
  //     - @Res({ passthrough: true }) res: Response로 응답 객체를 받습니다
  //       (passthrough: true는 NestJS가 응답을 자동으로 처리하도록 합니다)
  //     - setupTokens(req.user, res)를 호출하여 쿠키에 토큰을 설정합니다
  //     - toUserDTO(req.user)를 반환합니다
  //
  // (2) POST /api/auth/signup
  //     - @Body() body: CreateUserDTO로 요청 본문을 받습니다
  //     - this.usersService.createUser(body)로 사용자를 생성합니다
  //     - toUserDTO()로 변환하여 반환합니다
  //     - 인증 불필요 (Guard 없음)
  //
  // (3) POST /api/auth/toggleAdmin
  //     - @UseGuards(JwtAuthGuard)로 JWT 인증이 필요합니다
  //     - @JWTUser() user: JWTPayload로 현재 사용자 정보를 받습니다
  //     - @Res({ passthrough: true }) res: Response로 응답 객체를 받습니다
  //     - this.usersService.toggleAdmin(user.id)로 관리자 권한을 토글합니다
  //     - setupTokens(updated, res)로 새 토큰을 설정합니다 (isAdmin이 바뀌었으므로)
  //     - toUserDTO(updated)를 반환합니다
  //
  // (4) private setupTokens(user: User, res: Response) - 토큰 설정 헬퍼
  //     - User에서 JWTPayload를 만듭니다: { id: user.id, isAdmin: user.isAdmin }
  //     - this.authService.getAccessTokenAndOptions(payload)로 Access 토큰을 생성합니다
  //     - this.authService.getRefreshTokenAndOptions(payload)로 Refresh 토큰을 생성합니다
  //     - this.usersService.updateRefreshToken(user.id, refresh.token)으로 DB에 저장합니다
  //     - res.cookie('jwt', access.token, access.options)로 Access 쿠키를 설정합니다
  //     - res.cookie('refresh', refresh.token, refresh.options)로 Refresh 쿠키를 설정합니다
  //
  // 힌트: LocalAuthGuard는 'local' 전략을 사용합니다 (email/password → req.user)
  //       @Res({ passthrough: true })를 사용하면 return 값이 응답 바디가 됩니다.
  // ===========================================================================

  // TODO: 여기에 login, signup, toggleAdmin 엔드포인트와 setupTokens 메서드를 구현하세요.
}
