import { Controller, Get, UseGuards, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserProfileDTO, toUserProfileDTO } from 'src/common/dto/users/users.dto';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { JWTUser } from 'src/common/decorators/jwtuser.decorator';
import { ReviewsService } from 'src/reviews/reviews.service';
import { toReviewWithLikesDTO } from 'src/common/dto/reviews/reviews.dto';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly reviewsService: ReviewsService,
  ) { }

  // ===========================================================================
  // TODO 3: Controller의 라우트 핸들러 구현하기
  // ===========================================================================
  // NestJS의 Controller는 HTTP 요청을 받아 적절한 서비스 메서드를 호출하고
  // 응답을 반환하는 역할을 합니다.
  //
  // 이 컨트롤러는 'api/users' 경로 하위의 요청을 처리합니다.
  // 모든 엔드포인트는 JWT 인증이 필요합니다 (@UseGuards(JwtAuthGuard)).
  //
  // 사용 가능한 서비스 메서드:
  //   - this.usersService.getUserWithDeptById(id): 사용자 정보(학과 포함) 조회
  //   - this.reviewsService.getReviewsOfUser(userId): 사용자가 작성한 리뷰 목록
  //   - this.reviewsService.getReviewsLikedByUser(userId): 사용자가 좋아요한 리뷰 목록
  //
  // DTO 변환 함수:
  //   - toUserProfileDTO(user): User 엔티티를 UserProfileDTO로 변환
  //   - toReviewWithLikesDTO(userId): 리뷰를 좋아요 정보 포함 DTO로 변환 (커링 함수)
  //
  // 커스텀 데코레이터:
  //   - @JWTUser(): JWT 토큰에서 파싱된 유저 정보(JWTPayload)를 주입받는 파라미터 데코레이터
  //     (JWTPayload 타입: { id: number, isAdmin: boolean })
  //
  // 구현할 엔드포인트 3개:
  //
  // (1) GET /api/users/profile
  //     - JWT 인증 필요
  //     - jwt.id로 사용자 정보를 조회하고 toUserProfileDTO로 변환하여 반환
  //     - 반환 타입: Promise<UserProfileDTO>
  //
  // (2) GET /api/users/reviews
  //     - JWT 인증 필요
  //     - jwt.id로 사용자가 작성한 리뷰 목록을 조회
  //     - 각 리뷰를 toReviewWithLikesDTO(jwt.id)로 변환하여 배열로 반환
  //
  // (3) GET /api/users/reviews/likes
  //     - JWT 인증 필요
  //     - jwt.id로 사용자가 좋아요한 리뷰 목록을 조회
  //     - 각 리뷰를 toReviewWithLikesDTO(jwt.id)로 변환하여 배열로 반환
  //
  // 힌트: @UseGuards(JwtAuthGuard)와 @Get('경로') 데코레이터를 메서드 위에 붙이세요.
  //       @JWTUser() 데코레이터로 JWT payload를 파라미터로 받을 수 있습니다.
  // ===========================================================================

  // TODO: 여기에 3개의 라우트 핸들러를 구현하세요.
}
