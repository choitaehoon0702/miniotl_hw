import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JWTPayload, TokenAndCookieOptions, TokenRefreshPayload, toJWTPayload } from 'src/common/dto/auth/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenInvalidException } from './refresh.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  // ===========================================================================
  // TODO 6: AuthService - 인증 서비스 핵심 메서드 구현하기
  // ===========================================================================
  // AuthService는 사용자 인증(Authentication)의 핵심 로직을 담당합니다.
  // 로그인 검증, JWT 토큰 생성, Refresh 토큰 검증 등을 처리합니다.
  //
  // 사용 가능한 의존성:
  //   - this.usersService: 사용자 조회/수정 서비스
  //   - this.jwtService: JWT 토큰 서명(sign) 서비스 (@nestjs/jwt)
  //   - this.configService: 환경 변수 접근 (.env 파일의 값)
  //
  // 아래 4개의 메서드를 구현하세요:
  //
  // (1) validateUser(email, password) → User | null
  //     - 이메일로 사용자를 조회합니다 (this.usersService.getByEmail(email))
  //     - bcrypt.compare(password, user.encryptedPassword)로 비밀번호를 비교합니다
  //     - 비밀번호가 일치하면 user 객체를 반환, 아니면 null
  //     - getByEmail이 예외를 던질 수 있으므로 try-catch로 감싸고,
  //       예외 발생 시에도 null을 반환합니다 (사용자 없음과 동일하게 처리)
  //
  // (2) validateRefreshAndGenerateAccessToken(userId, refreshToken) → TokenRefreshPayload
  //     - userId로 사용자를 조회합니다 (this.usersService.getUserById(userId))
  //     - DB에 저장된 refreshToken과 요청의 refreshToken이 다르면
  //       RefreshTokenInvalidException()을 throw합니다
  //     - 일치하면 JWTPayload를 만들고 ({ id: user.id, isAdmin: user.isAdmin })
  //     - { ...payload, access: this.getAccessTokenAndOptions(payload) }를 반환합니다
  //     - 반환 타입은 TokenRefreshPayload입니다
  //
  // (3) getAccessTokenAndOptions(payload) → TokenAndCookieOptions
  //     - this.jwtService.sign()으로 Access JWT 토큰을 생성합니다
  //       인자: toJWTPayload(payload)
  //       옵션: {
  //         secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
  //         expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXP_SEC')}s`
  //       }
  //     - 반환 객체: { token, options }
  //       options: {
  //         domain: 'localhost',
  //         path: '/',
  //         httpOnly: true,
  //         maxAge: Number(this.configService.get('JWT_ACCESS_TOKEN_EXP_SEC')) * 1000
  //       }
  //
  // (4) getRefreshTokenAndOptions(payload) → TokenAndCookieOptions
  //     - getAccessTokenAndOptions와 동일한 구조이지만:
  //       - secret: 'JWT_REFRESH_TOKEN_SECRET' 사용
  //       - expiresIn/maxAge: 'JWT_REFRESH_TOKEN_EXP_SEC' 사용
  //
  // 힌트: bcrypt는 이미 import되어 있습니다 (import * as bcrypt from 'bcrypt')
  //       toJWTPayload, TokenAndCookieOptions, TokenRefreshPayload는 auth.dto에서 import됩니다
  // ===========================================================================
  async validateUser(email: string, password: string) {
    // TODO: 여기에 사용자 인증 로직을 구현하세요.
    return null;
  }

  async validateRefreshAndGenerateAccessToken(userId: number, refreshToken: string): Promise<TokenRefreshPayload> {
    // TODO: 여기에 Refresh 토큰 검증 및 Access 토큰 재발급 로직을 구현하세요.
    throw new RefreshTokenInvalidException();
  }

  getAccessTokenAndOptions(payload: JWTPayload): TokenAndCookieOptions {
    // TODO: 여기에 Access 토큰 생성 및 쿠키 옵션 반환 로직을 구현하세요.
    return { token: '', options: { domain: 'localhost', path: '/', httpOnly: true, maxAge: 0 } };
  }

  getRefreshTokenAndOptions(payload: JWTPayload): TokenAndCookieOptions {
    // TODO: 여기에 Refresh 토큰 생성 및 쿠키 옵션 반환 로직을 구현하세요.
    return { token: '', options: { domain: 'localhost', path: '/', httpOnly: true, maxAge: 0 } };
  }
}
