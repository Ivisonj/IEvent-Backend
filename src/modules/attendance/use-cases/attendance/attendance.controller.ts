import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { AttendanceUseCase } from './attendance.useCase';
import { AttendanceDTOrequest } from './attendance.DTO';
import { AttendanceErrors } from './attendance.errors';
import { AttendanceDTO } from '../../dtos/attendence.DTO';

@Controller('api/v1/attendance')
@ApiTags('Attendance')
export class AttendanceController {
  constructor(private readonly useCase: AttendanceUseCase) {}
  @ApiCreatedResponse({
    description: '',
    type: AttendanceDTO,
  })
  @Post()
  async attendance(
    @Body(new ValidationPipe()) dto: AttendanceDTOrequest,
    @Req() request: AttendanceDTOrequest,
  ) {
    const userId = request.userId;
    dto.userId = userId;
    const result = await this.useCase.execute(dto);
    if (result.isLeft()) {
      const error = result.value;
      if (error.constructor === AttendanceErrors.FailSolicitation) {
        throw new ConflictException(error);
      } else {
        throw new BadRequestException(error);
      }
    } else {
      return result.value;
    }
  }
}
