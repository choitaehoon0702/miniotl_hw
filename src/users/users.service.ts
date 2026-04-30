import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from 'src/common/dto/users/users.dto';
import { UserRepository } from 'src/prisma/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

// TODO: set default in configmodule
const DEFAULT_SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) { }

  // ===========================================================================
  // TODO 13: UsersService - 사용자 서비스 구현하기
  // ===========================================================================
  // UsersService는 사용자 관련 비즈니스 로직을 담당합니다.
  //
  // 사용 가능한 의존성:
  //   - this.userRepository: Prisma를 통한 DB 접근 (UserRepository)
  //   - this.configService: 환경 변수 접근
  //   - bcrypt: 비밀번호 해싱 라이브러리 (import * as bcrypt from 'bcrypt')
  //
  // 아래 6개의 메서드를 구현하세요:
  //
  // (1) createUser(data: CreateUserDTO)
  //     - 먼저 이메일 중복을 확인합니다:
  //       this.userRepository.getByEmail(data.email)이 존재하면
  //       ConflictException('Email already exists')를 throw합니다
  //     - data에서 password를 분리합니다: const { password, ...rest } = data;
  //     - bcrypt.hash()로 비밀번호를 해싱합니다:
  //       bcrypt.hash(password, this.configService.get('BCRYPT_SALT_ROUNDS') ?? DEFAULT_SALT_ROUNDS)
  //     - this.userRepository.create({ ...rest, encryptedPassword: 해시된비밀번호 })로 생성합니다
  //
  // (2) updateRefreshToken(userId, refreshToken)
  //     - this.userRepository.updateRefreshToken(userId, refreshToken)을 호출합니다
  //
  // (3) getUserById(id)
  //     - this.userRepository.getById(id)로 사용자를 조회합니다
  //     - 없으면 NotFoundException('User not found')를 throw합니다
  //
  // (4) getUserWithDeptById(id)
  //     - this.userRepository.getUserWithDeptById(id)로 학과 포함 조회합니다
  //     - 없으면 NotFoundException('User not found')를 throw합니다
  //
  // (5) getByEmail(email)
  //     - this.userRepository.getByEmail(email)로 조회합니다
  //     - 없으면 NotFoundException('User not found')를 throw합니다
  //
  // (6) toggleAdmin(id)
  //     - 먼저 getUserById(id)로 사용자를 조회합니다
  //     - this.userRepository.setAdmin(id, !user.isAdmin)으로 관리자 상태를 토글합니다
  //
  // 힌트: ConflictException, NotFoundException는 '@nestjs/common'에서 import됩니다.
  //       DEFAULT_SALT_ROUNDS는 파일 상단에 10으로 정의되어 있습니다.
  // ===========================================================================

  async createUser(data: CreateUserDTO) {
    // TODO: 이메일 중복 확인 후 비밀번호를 해싱하여 사용자를 생성하세요.
    return {} as any;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    // TODO: 사용자의 Refresh Token을 DB에 저장하세요.
  }

  async getUserById(id: number) {
    // TODO: ID로 사용자를 조회하세요. 없으면 NotFoundException을 throw하세요.
    throw new NotFoundException('User not found');
  }

  async getUserWithDeptById(id: number) {
    // TODO: ID로 사용자를 학과 정보 포함 조회하세요. 없으면 NotFoundException을 throw하세요.
    throw new NotFoundException('User not found');
  }

  async getByEmail(email: string) {
    // TODO: 이메일로 사용자를 조회하세요. 없으면 NotFoundException을 throw하세요.
    throw new NotFoundException('User not found');
  }

  async toggleAdmin(id: number) {
    // TODO: 사용자의 관리자 권한을 토글하세요.
    return {} as any;
  }
}
