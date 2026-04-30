import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { UserCreateDTO, UserWithDept } from './repository.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) { }

  // ===========================================================================
  // TODO 21: UserRepository - Prisma 사용자 CRUD 구현하기
  // ===========================================================================
  // UserRepository는 Prisma Client를 사용하여 User 테이블에 접근합니다.
  // this.prisma.user 객체의 create, update, findUnique 등을 사용합니다.
  //
  // (1) create(data: UserCreateDTO): Promise<User>
  //     - this.prisma.user.create({ data: { ... } })로 생성
  //     - data에서 email, encryptedPassword, firstName, lastName, isAdmin을 직접 넣고
  //     - department는 { connect: { id: data.departmentId } }로 연결
  //     힌트: Prisma의 관계 연결은 connect를 사용합니다.
  //
  // (2) updateRefreshToken(userId: number, refreshToken: string): Promise<User>
  //     - this.prisma.user.update({ where: { id: userId }, data: { refreshToken } })
  //
  // (3) getUserWithDeptById(id: number): Promise<UserWithDept | null>
  //     - this.prisma.user.findUnique({ where: { id }, include: { department: true } })
  //     힌트: include를 사용하면 관계된 데이터를 함께 조회할 수 있습니다.
  //
  // (4) getById(id: number): Promise<User | null>
  //     - this.prisma.user.findUnique({ where: { id } })
  //
  // (5) getByEmail(email: string): Promise<User | null>
  //     - this.prisma.user.findUnique({ where: { email } })
  //
  // (6) setAdmin(id: number, isAdmin: boolean): Promise<User>
  //     - this.prisma.user.update({ where: { id }, data: { isAdmin } })
  // ===========================================================================

  async create(data: UserCreateDTO): Promise<User> {
    // TODO: Prisma user.create로 사용자를 생성하세요. department는 connect로 연결.
    return {} as any;
  }

  async updateRefreshToken(userId: number, refreshToken: string): Promise<User> {
    // TODO: Prisma user.update로 refreshToken을 업데이트하세요.
    return {} as any;
  }

  async getUserWithDeptById(id: number): Promise<UserWithDept | null> {
    // TODO: Prisma user.findUnique로 department include하여 조회하세요.
    return null;
  }

  async getById(id: number): Promise<User | null> {
    // TODO: Prisma user.findUnique로 ID로 조회하세요.
    return null;
  }

  async getByEmail(email: string): Promise<User | null> {
    // TODO: Prisma user.findUnique로 email로 조회하세요.
    return null;
  }

  async setAdmin(id: number, isAdmin: boolean): Promise<User> {
    // TODO: Prisma user.update로 isAdmin을 업데이트하세요.
    return {} as any;
  }
}
