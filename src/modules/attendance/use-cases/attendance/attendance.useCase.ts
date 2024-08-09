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
import {
  Notification,
  NotificationTypes,
  SenderTypes,
} from 'src/modules/notification/domain/notification';
import { INotificationRepository } from 'src/modules/notification/repositories/notification-repository.interface';

export type AttendanceResponse = Either<
  AttendanceErrors.FailSolicitation | Error,
  AttendanceDTO
>;

@Injectable()
export class AttendanceUseCase {
  constructor(
    private readonly attendanceRepository: IAttendanceRepository,
    private readonly notificationRepository: INotificationRepository,
  ) {}

  public async execute(
    bodyData: AttendanceBodyDataDTO,
    headerData: AttendanceHeaderDataDTO,
  ): Promise<AttendanceResponse> {
    const participantData = await this.attendanceRepository.participantData(
      headerData.userId,
      bodyData.eventId,
    );

    if (!participantData)
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

    const event = await this.attendanceRepository.findEvent(bodyData.eventId);

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

      if (participantStatus === AttendanceStatus.presence) {
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
      } else if (participantStatus === AttendanceStatus.late) {
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
            AttendanceStatus.late,
          );

        console.log(
          'updateParticipantAttendance',
          updateParticipantAttendance.lateCount,
        );

        if (!updateParticipantAttendance)
          return left(new AttendanceErrors.FailUpdateParticipantAttendance());

        if (updateParticipantAttendance.lateCount + 1 === event.delays_limit) {
          const notification = await Notification.create({
            userId: headerData.userId,
            eventId: bodyData.eventId,
            message: 'Você está próximo de atingir o limite de atrasos!',
            type: 'alert' as NotificationTypes,
            sender: SenderTypes.event,
            createdAt: CustomDate.fixTimezoneoffset(new Date()),
            readed: false,
          });

          await this.notificationRepository.notify(notification);
        } else if (
          updateParticipantAttendance.lateCount === event.delays_limit
        ) {
          const notification = await Notification.create({
            userId: headerData.userId,
            eventId: bodyData.eventId,
            message: 'Você atingiu o limite de atrasos!',
            type: 'alert' as NotificationTypes,
            sender: SenderTypes.event,
            createdAt: CustomDate.fixTimezoneoffset(new Date()),
            readed: false,
          });

          await this.notificationRepository.notify(notification);
        }

        const attendance =
          await this.attendanceRepository.create(attendanceOrError);
        const dto = AttendanceMapper.toDTO(attendance);
        return right(dto);
      }
    } else {
      const attendanceOrError = Attendance.create({
        userId: headerData.userId,
        eventId: bodyData.eventId,
        eventLogId: bodyData.eventLogId,
        checkedInAt: CustomDate.fixTimezoneoffset(new Date()),
        status: AttendanceStatus.presence,
      });

      const updateParticipantPresence =
        await this.attendanceRepository.updateParticipantAttendance(
          bodyData.eventId,
          headerData.userId,
          AttendanceStatus.presence,
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
