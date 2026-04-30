import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import {
  CourseFindQueryDTO,
  courseWithDeptToCourseDTO,
  toCourseWithLecturesDTO,
  toCourseWithUnseenReviewDTO,
} from 'src/common/dto/courses/courses.dto';
import { ReviewsService } from 'src/reviews/reviews.service';
import {
  CreateReviewDTO,
  toReviewDTO,
  ReviewCreateBodyDTO,
  ReviewUpdateBodyDTO,
  UpdateReviewDTO,
  toReviewWithLikesDTO,
} from 'src/common/dto/reviews/reviews.dto';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { JWTUser } from 'src/common/decorators/jwtuser.decorator';
import { Public } from 'src/auth/decorator/skip-auth.decorator';
import { toUserLastSeenReviewOnCourseDTO } from 'src/common/dto/courses/userLastSeenReviewOnCourse.dto';
import {
  CourseWithDept,
  CourseWithDeptAndLastSeenReview,
  isCourseWithDeptAndLastSeenReview,
} from 'src/prisma/repositories/repository.dto';

@Controller('api/courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly reviewsService: ReviewsService,
  ) { }

  // ===========================================================================
  // TODO 14: CoursesController - 과목/리뷰 엔드포인트 구현하기
  // ===========================================================================
  // 이 컨트롤러는 'api/courses' 경로의 요청을 처리합니다.
  // 과목 검색, 강의별 리뷰 CRUD, 리뷰 확인 등 다양한 기능을 제공합니다.
  //
  // 사용 가능한 서비스:
  //   - this.coursesService.findFiltered(filter, userId): 필터링된 과목 목록
  //   - this.coursesService.getCourseWithLectures(id): 과목 상세 (강의 포함)
  //   - this.coursesService.userSawReviewOnCourse(courseId, userId): 리뷰 확인 처리
  //   - this.reviewsService.getReviewsWithLikesByCourseId(id, userId): 과목별 리뷰
  //   - this.reviewsService.getReviewsWithLikesByLectureId(lectureId, userId): 강의별 리뷰
  //   - this.reviewsService.createReview(dto): 리뷰 생성
  //   - this.reviewsService.updateReviewByUser(dto): 리뷰 수정
  //   - this.reviewsService.getReviewWithLikesById(reviewId, userId): 리뷰 상세
  //   - this.reviewsService.deleteReviewByAdmin(reviewId): 관리자 리뷰 삭제
  //
  // DTO 변환 함수:
  //   - courseWithDeptToCourseDTO / toCourseWithUnseenReviewDTO / toCourseWithLecturesDTO
  //   - toReviewDTO(userId) / toReviewWithLikesDTO(userId) (커링 함수)
  //   - toUserLastSeenReviewOnCourseDTO
  //
  // 특별한 패턴:
  //   - @UseGuards(JwtAuthGuard) + @Public(): 선택적 인증 (로그인 시 추가 정보 제공)
  //     → user 파라미터가 optional (?)이 됩니다
  //   - @UseGuards(JwtAuthGuard, AdminGuard): 관리자만 접근 가능
  //
  // 구현할 엔드포인트 8개:
  //
  // (1) GET /api/courses
  //     - @UseGuards(JwtAuthGuard) + @Public() (선택적 인증)
  //     - @Query() filter: CourseFindQueryDTO, @JWTUser() user?: JWTPayload
  //     - coursesService.findFiltered(filter, user?.id) 호출
  //     - 결과가 CourseWithDeptAndLastSeenReview[]이면 toCourseWithUnseenReviewDTO로 변환
  //       아니면 courseWithDeptToCourseDTO로 변환
  //     - isCourseWithDeptAndLastSeenReviewArray() 헬퍼 함수 사용 (파일 하단에 정의되어 있음)
  //
  // (2) GET /api/courses/:id
  //     - 인증 불필요
  //     - @Param('id') id: number
  //     - coursesService.getCourseWithLectures(id) 호출
  //     - 없으면 NotFoundException('Course not found')
  //     - toCourseWithLecturesDTO로 변환하여 반환
  //
  // (3) GET /api/courses/:id/reviews
  //     - @UseGuards(JwtAuthGuard) + @Public() (선택적 인증)
  //     - reviewsService.getReviewsWithLikesByCourseId(id, user?.id)
  //     - 결과를 toReviewWithLikesDTO(user?.id)로 map
  //
  // (4) GET /api/courses/lectures/:lectureId/reviews
  //     - @UseGuards(JwtAuthGuard) + @Public() (선택적 인증)
  //     - reviewsService.getReviewsWithLikesByLectureId(lectureId, user?.id)
  //     - 결과를 toReviewWithLikesDTO(user?.id)로 map
  //
  // (5) POST /api/courses/lectures/:lectureId/reviews
  //     - @UseGuards(JwtAuthGuard), @HttpCode(201)
  //     - @JWTUser() user, @Param('lectureId') lectureId, @Body() review: ReviewCreateBodyDTO
  //     - CreateReviewDTO를 조합: { ...review, lectureId, userId: user.id }
  //     - reviewsService.createReview(dto)를 toReviewDTO(user.id)로 변환
  //
  // (6) PATCH /api/courses/lectures/:lectureId/reviews/:id
  //     - @UseGuards(JwtAuthGuard), @HttpCode(200)
  //     - UpdateReviewDTO를 조합: { ...review, id, lectureId, userId: user.id }
  //     - reviewsService.updateReviewByUser(dto)를 toReviewDTO(user.id)로 변환
  //
  // (7) GET /api/courses/lectures/reviews/:reviewId
  //     - @UseGuards(JwtAuthGuard) + @Public() (선택적 인증)
  //     - reviewsService.getReviewWithLikesById(reviewId, user?.id)
  //     - 없거나 isDeleted이면 NotFoundException('Review not found')
  //     - toReviewWithLikesDTO(user?.id)로 변환
  //
  // (8) DELETE /api/courses/:id/lectures/:lectureId/reviews/:reviewId
  //     - @UseGuards(JwtAuthGuard, AdminGuard), @HttpCode(204)
  //     - reviewsService.deleteReviewByAdmin(reviewId) 호출
  //
  // (9) POST /api/courses/:id/reviews/seen
  //     - @UseGuards(JwtAuthGuard)
  //     - coursesService.userSawReviewOnCourse(id, user.id) 호출
  //     - 결과가 없으면 toUserLastSeenReviewOnCourseDTO({ userId, courseId, lastSeenReviewId: null }) 반환
  //     - 있으면 toUserLastSeenReviewOnCourseDTO(result) 반환
  //
  // 힌트: @HttpCode, @Patch, @Delete, @Query, @Param, @Body 데코레이터를 활용하세요.
  //       커링 함수는 toReviewDTO(userId)(review) 형태로 호출합니다.
  // ===========================================================================

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get()
  async findCourses(
    @Query() filter: CourseFindQueryDTO,
    @JWTUser() user?: JWTPayload,
  ) {
    const courses = await this.coursesService.findFiltered(filter, user?.id);

    if (isCourseWithDeptAndLastSeenReviewArray(courses)) {
      return courses.map(toCourseWithUnseenReviewDTO);
    }

    return courses.map(courseWithDeptToCourseDTO);
  }

  @Get(':id')
  async getCourse(@Param('id') id: string) {
    const course = await this.coursesService.getCourseWithLectures(Number(id));

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return toCourseWithLecturesDTO(course);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get(':id/reviews')
  async getCourseReviews(
    @Param('id') id: string,
    @JWTUser() user?: JWTPayload,
  ) {
    const reviews = await this.reviewsService.getReviewsWithLikesByCourseId(
      Number(id),
      user?.id,
    );

    return reviews.map(toReviewWithLikesDTO(user?.id));
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get('lectures/:lectureId/reviews')
  async getLectureReviews(
    @Param('lectureId') lectureId: string,
    @JWTUser() user?: JWTPayload,
  ) {
    const reviews = await this.reviewsService.getReviewsWithLikesByLectureId(
      Number(lectureId),
      user?.id,
    );

    return reviews.map(toReviewWithLikesDTO(user?.id));
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post('lectures/:lectureId/reviews')
  async createReview(
    @JWTUser() user: JWTPayload,
    @Param('lectureId') lectureId: string,
    @Body() review: ReviewCreateBodyDTO,
  ) {
    const dto: CreateReviewDTO = {
      ...review,
      lectureId: Number(lectureId),
      userId: user.id,
    };

    const created = await this.reviewsService.createReview(dto);

    return toReviewDTO(user.id)(created);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Patch('lectures/:lectureId/reviews/:id')
  async updateReview(
    @JWTUser() user: JWTPayload,
    @Param('lectureId') lectureId: string,
    @Param('id') id: string,
    @Body() review: ReviewUpdateBodyDTO,
  ) {
    const dto: UpdateReviewDTO = {
      ...review,
      id: Number(id),
      lectureId: Number(lectureId),
      userId: user.id,
    };

    const updated = await this.reviewsService.updateReviewByUser(dto);

    return toReviewDTO(user.id)(updated);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get('lectures/reviews/:reviewId')
  async getReview(
    @Param('reviewId') reviewId: string,
    @JWTUser() user?: JWTPayload,
  ) {
    const review = await this.reviewsService.getReviewWithLikesById(
      Number(reviewId),
      user?.id,
    );

    if (!review || review.isDeleted) {
      throw new NotFoundException('Review not found');
    }

    return toReviewWithLikesDTO(user?.id)(review);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(204)
  @Delete(':id/lectures/:lectureId/reviews/:reviewId')
  async deleteReviewByAdmin(@Param('reviewId') reviewId: string) {
    await this.reviewsService.deleteReviewByAdmin(Number(reviewId));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reviews/seen')
  async markReviewSeen(
    @Param('id') id: string,
    @JWTUser() user: JWTPayload,
  ) {
    const courseId = Number(id);

    const result = await this.coursesService.userSawReviewOnCourse(
      courseId,
      user.id,
    );

    if (!result) {
      return toUserLastSeenReviewOnCourseDTO({
        userId: user.id,
        courseId,
        lastSeenReviewId: null,
      });
    }

    return toUserLastSeenReviewOnCourseDTO(result);
  }
}

function isCourseWithDeptAndLastSeenReviewArray(
  arg: CourseWithDept[] | CourseWithDeptAndLastSeenReview[],
): arg is CourseWithDeptAndLastSeenReview[] {
  return arg.some(isCourseWithDeptAndLastSeenReview);
}
