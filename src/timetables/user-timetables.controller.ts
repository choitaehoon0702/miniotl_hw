import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TimetablesService } from './timetables.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateTimetableBodyDTO, toTimetableWithLecturesDTO } from 'src/common/dto/timetables/timetables.dto';
import { JWTUser } from 'src/common/decorators/jwtuser.decorator';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';

@Controller('api/users/:userId/timetables')
export class UserTimetablesController {
  constructor(private readonly timetablesService: TimetablesService) { }

  // ===========================================================================
  // TODO 19: UserTimetablesController - 시간표 컨트롤러 구현하기
  // ===========================================================================
  // 이 컨트롤러는 'api/users/:userId/timetables' 경로의 요청을 처리합니다.
  // 모든 엔드포인트는 JWT 인증이 필요합니다.
  //
  // 중요: URL의 :userId와 JWT의 user.id를 비교하여
  // 타인의 시간표에 접근하지 못하도록 권한 검사를 합니다.
  // (user.id !== userId → ForbiddenException)
  //
  // 사용 가능한 서비스:
  //   - this.timetablesService.createTimetableForUser(data): 시간표 생성
  //   - this.timetablesService.getUserTimetablesWithLectures(userId): 전체 시간표 조회
  //   - this.timetablesService.getUserTimetableWithLectureById(userId, timetableId): 단일 조회
  //   - this.timetablesService.addLectureToTimetableForUser(userId, timetableId, lectureId): 강의 추가
  //   - this.timetablesService.removeLectureFromTimetableForUser(userId, timetableId, lectureId): 강의 제거
  //
  // DTO 변환:
  //   - toTimetableWithLecturesDTO(timetable): 시간표 + 강의 정보 DTO
  //
  // 구현할 엔드포인트 5개:
  //
  // (1) POST /api/users/:userId/timetables
  //     - @UseGuards(JwtAuthGuard)
  //     - @JWTUser() user, @Body() body: CreateTimetableBodyDTO
  //     - createTimetableForUser({ userId: user.id, ...body }) 호출
  //     - 결과에 lectures: []를 추가하여 toTimetableWithLecturesDTO로 변환
  //       (새로 만들어진 시간표는 강의가 없으므로)
  //
  // (2) GET /api/users/:userId/timetables
  //     - user.id !== userId면 ForbiddenException('You can only get your own timetables')
  //     - getUserTimetablesWithLectures(user.id) 호출
  //     - 결과를 map(toTimetableWithLecturesDTO)로 변환
  //
  // (3) GET /api/users/:userId/timetables/:timetableId
  //     - user.id !== userId면 ForbiddenException
  //     - getUserTimetableWithLectureById(user.id, timetableId)
  //     - toTimetableWithLecturesDTO로 변환
  //
  // (4) POST /api/users/:userId/timetables/:timetableId/lectures/:lectureId
  //     - user.id !== userId면 ForbiddenException('You can only add lectures to your own timetable')
  //     - addLectureToTimetableForUser(user.id, timetableId, lectureId)
  //     - toTimetableWithLecturesDTO로 변환
  //
  // (5) DELETE /api/users/:userId/timetables/:timetableId/lectures/:lectureId
  //     - user.id !== userId면 ForbiddenException('You can only remove lectures from your own timetable')
  //     - removeLectureFromTimetableForUser(user.id, timetableId, lectureId)
  //     - toTimetableWithLecturesDTO로 변환
  //
  // 힌트: @Param('userId'), @Param('timetableId'), @Param('lectureId')로 URL 파라미터를 받습니다.
  //       ForbiddenException은 '@nestjs/common'에서 import합니다.
  // ===========================================================================

  // TODO: 여기에 5개의 엔드포인트를 구현하세요.
}
