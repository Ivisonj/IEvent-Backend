import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import {
  AttendanceHeaderDataDTO,
  AttendanceBodyDataDTO,
} from './attendance.DTO';
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
    bodyData: AttendanceBodyDataDTO,
    headerData: AttendanceHeaderDataDTO,
  ): Promise<AttendanceResponse> {
    const isParticipant = await this.attendanceRepository.isParticipant(
      headerData.userId,
      bodyData.eventId,
    );

    if (!isParticipant)
      return left(new AttendanceErrors.UserOrEventDoesNotMatch());

    const registerExists = await this.attendanceRepository.eventLogExists(
      bodyData.eventLogId,
    );

    if (!registerExists) return left(new AttendanceErrors.EventLogNotFound());

    const attendanceRecordExists =
      await this.attendanceRepository.attendanceRecordExists(
        bodyData.eventLogId,
        headerData.userId,
      );

    if (attendanceRecordExists)
      return left(new AttendanceErrors.PresenceAlreadyConfirmed());

    const event = await this.attendanceRepository.getEvent(bodyData.eventId);
    const eventStartTime = await this.attendanceRepository.eventStartTime(
      bodyData.eventLogId,
    );

    if (event.custom_rules) {
      const startTime = new Date(eventStartTime);
      const checkedInAt = CustomDate.fixTimezoneoffset(new Date());

      const participantStatus =
        checkedInAt.getMinutes() - startTime.getMinutes() <=
        event.tolerance_time
          ? AttendanceStatus.presence
          : AttendanceStatus.late;

      const attendanceOrError = Attendance.create({
        userId: headerData.userId,
        eventId: bodyData.eventId,
        eventLogId: bodyData.eventLogId,
        checkedInAt: CustomDate.fixTimezoneoffset(new Date()),
        status: participantStatus,
      });

      const updateParticipantAttendance =
        await this.attendanceRepository.updateParticipantAttendance(
          bodyData.eventId,
          headerData.userId,
          AttendanceStatus.presence,
        );

      if (!updateParticipantAttendance)
        return left(new AttendanceErrors.FailUpdateParticipantAttendance());

      const attendance =
        await this.attendanceRepository.create(attendanceOrError);
      const dto = AttendanceMapper.toDTO(attendance);
      return right(dto);
    } else {
      const attendanceOrError = Attendance.create({
        userId: headerData.userId,
        eventId: bodyData.eventId,
        eventLogId: bodyData.eventLogId,
        checkedInAt: CustomDate.fixTimezoneoffset(new Date()),
        status: AttendanceStatus.presence,
      });

      const updateParticipantPresence =
        await this.attendanceRepository.updateParticipantPresence(
          bodyData.eventId,
          headerData.userId,
        );

      if (!updateParticipantPresence)
        return left(new AttendanceErrors.FailUpdateParticipantAttendance());

      const attendance =
        await this.attendanceRepository.create(attendanceOrError);
      const dto = AttendanceMapper.toDTO(attendance);
      return right(dto);
    }
  }
}
