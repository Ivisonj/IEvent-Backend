import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import { AttendanceDTOrequest } from './attendance.DTO';
import { AttendanceErrors } from './attendance.errors';
import { Attendance, AttendanceStatus } from '../../domain/attendance';
import { AttendanceMapper } from '../../mappers/attendance.map';
import { IAttendanceRepository } from '../../repositories/attendance-repository.interface';
import { AttendanceDTO } from '../../dtos/attendence.DTO';
import { CustomDate } from 'src/shared/application/customDate';

export type AttendanceResponse = Either<
  AttendanceErrors.FailSolicitation | Error,
  AttendanceDTO
>;

@Injectable()
export class AttendanceUseCase {
  constructor(private readonly attendanceRepository: IAttendanceRepository) {}

  public async execute(
    request: AttendanceDTOrequest,
  ): Promise<AttendanceResponse> {
    const isParticipant = await this.attendanceRepository.isParticipant(
      request.userId,
      request.eventId,
    );

    if (!isParticipant)
      return left(new AttendanceErrors.UserOrEventDoesNotMatch());

    const registerExists = await this.attendanceRepository.registerExists(
      request.registerEventsId,
    );

    if (!registerExists)
      return left(new AttendanceErrors.RegisterEventNotFound());

    const event = await this.attendanceRepository.getEvent(request.eventId);
    const eventStartTime = await this.attendanceRepository.eventStartTime(
      request.registerEventsId,
    );

    if (event.custom_rules) {
      const startTime = new Date(eventStartTime);
      const checkedInAt = CustomDate.fixTimezoneoffset(new Date());

      // const userStatus = checkedInAt.getMinutes() - startTime.getMinutes() <= event
    } else {
      const attendanceOrError = Attendance.create({
        userId: request.userId,
        eventId: request.eventId,
        registerEventsId: request.registerEventsId,
        checkedInAt: CustomDate.fixTimezoneoffset(new Date()),
        status: AttendanceStatus.presence,
      });

      const attendance =
        await this.attendanceRepository.create(attendanceOrError);
      const dto = AttendanceMapper.toDTO(attendance);
      return right(dto);
    }
  }
}
