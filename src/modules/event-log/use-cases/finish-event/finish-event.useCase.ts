import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import { IEventLogRepository } from '../../repositories/event-log-repository.interface';
import {
  FinishEventHeaderDataDTO,
  FinishEventBodyDataDTO,
} from './finish-event.DTO';
import { FinishEventErrors } from './finish-event.errors';
import { EventLogMapper } from '../../mappers/eventLog.map';
import { EventLogDTO } from '../../dtos/event-log.DTO';
import { CustomDate } from 'src/shared/application/customDate';
import { INotificationRepository } from 'src/modules/notification/repositories/notification-repository.interface';
import {
  Notification,
  NotificationTypes,
  SenderTypes,
} from 'src/modules/notification/domain/notification';
import {
  Attendance,
  AttendanceStatus,
} from 'src/modules/attendance/domain/attendance';

export type FinishEventResponse = Either<
  FinishEventErrors.FailToFinishEvent | Error,
  EventLogDTO
>;

@Injectable()
export class FinishEventUseCase {
  constructor(
    private readonly eventLogRepository: IEventLogRepository,
    private readonly notificationRepository: INotificationRepository,
  ) {}

  public async execute(
    eventLogId: string,
    bodyData: FinishEventBodyDataDTO,
    headerData: FinishEventHeaderDataDTO,
  ): Promise<FinishEventResponse> {
    const registerExists =
      await this.eventLogRepository.registerExists(eventLogId);

    if (!registerExists) return left(new FinishEventErrors.EventLogNotFound());

    const eventFinished =
      await this.eventLogRepository.eventFinished(eventLogId);

    if (!eventFinished)
      return left(new FinishEventErrors.EventAlreadyFinished());

    const isUserEventCreator = await this.eventLogRepository.isUserEventCreator(
      bodyData.eventId,
      headerData.userId,
    );

    if (!isUserEventCreator)
      return left(new FinishEventErrors.FailToFinishEvent());

    const endTime = CustomDate.fixTimezoneoffset(new Date());

    const eventEnded = await this.eventLogRepository.endEvent(
      eventLogId,
      endTime,
    );

    if (!eventEnded) return left(new FinishEventErrors.FailToFinishEvent());

    const notification = Notification.create({
      userId: headerData.userId,
      eventId: bodyData.eventId,
      message: 'O evento terminou!',
      type: 'alert' as NotificationTypes,
      sender: SenderTypes.event,
      createdAt: CustomDate.fixTimezoneoffset(new Date()),
      readed: false,
    });

    await this.notificationRepository.notify(notification);

    const participants = await this.eventLogRepository.findParticipants(
      bodyData.eventId,
    );

    const participantsPresent =
      await this.eventLogRepository.participantsPresent(eventLogId);

    const participantsPresentIds = new Set(
      participantsPresent.map((p) => p.userId),
    );

    const absentees = participants.filter(
      (p) => !participantsPresentIds.has(p.userId),
    );

    if (participantsPresent) {
      const participantAbsences = absentees.map((absence) =>
        Attendance.create({
          userId: absence.userId,
          eventId: absence.eventId,
          eventLogId: eventLogId,
          checkedInAt: CustomDate.fixTimezoneoffset(new Date()),
          status: AttendanceStatus.absence,
        }),
      );
      await this.eventLogRepository.putParticipantAbsences(participantAbsences);

      await this.eventLogRepository.updateParticipantAbsence(
        bodyData.eventId,
        absentees,
      );

      const eventData = await this.eventLogRepository.eventExists(
        bodyData.eventId,
      );

      if (eventData) {
        const absentParticipants =
          await this.eventLogRepository.absentParticipants(
            bodyData.eventId,
            absentees,
          );

        const participantNearAbsenceLimit = absentParticipants.filter(
          (participant) =>
            participant.absenceCount + 1 === eventData.absences_limit,
        );

        if (participantNearAbsenceLimit.length > 0) {
          for (const participant of participantNearAbsenceLimit) {
            const notifications = Notification.create({
              userId: participant.userId,
              eventId: bodyData.eventId,
              message: 'Você está próximo de atingir o limite de faltas!',
              type: 'alert' as NotificationTypes,
              sender: SenderTypes.event,
              createdAt: CustomDate.fixTimezoneoffset(new Date()),
              readed: false,
            });
            await this.notificationRepository.notify(notifications);
          }
        }

        const participantAtMaxAbsences = absentParticipants.filter(
          (participant) =>
            participant.absenceCount === eventData.absences_limit,
        );

        if (participantAtMaxAbsences.length > 0) {
          for (const participant of participantAtMaxAbsences) {
            const notifications = Notification.create({
              userId: participant.userId,
              eventId: bodyData.eventId,
              message: 'Você atintiu o limite de faltas!',
              type: 'alert' as NotificationTypes,
              sender: SenderTypes.event,
              createdAt: CustomDate.fixTimezoneoffset(new Date()),
              readed: false,
            });
            await this.notificationRepository.notify(notifications);
          }
        }
      }
    } else {
      const participantAbsences = participants.map((absence) =>
        Attendance.create({
          userId: absence.userId,
          eventId: absence.eventId,
          eventLogId: eventLogId,
          checkedInAt: CustomDate.fixTimezoneoffset(new Date()),
          status: AttendanceStatus.absence,
        }),
      );
      await this.eventLogRepository.putParticipantAbsences(participantAbsences);

      await this.eventLogRepository.updateParticipantAbsence(
        bodyData.eventId,
        participants,
      );

      const eventData = await this.eventLogRepository.eventExists(
        bodyData.eventId,
      );

      if (eventData) {
        const absentParticipants =
          await this.eventLogRepository.absentParticipants(
            bodyData.eventId,
            participants,
          );

        const participantNearAbsenceLimit = absentParticipants.filter(
          (participant) =>
            participant.absenceCount + 1 === eventData.absences_limit,
        );

        if (participantNearAbsenceLimit.length > 0) {
          for (const participant of participantNearAbsenceLimit) {
            const notifications = Notification.create({
              userId: participant.userId,
              eventId: bodyData.eventId,
              message: 'Você está próximo de atingir o limite de faltas!',
              type: 'alert' as NotificationTypes,
              sender: SenderTypes.event,
              createdAt: CustomDate.fixTimezoneoffset(new Date()),
              readed: false,
            });
            await this.notificationRepository.notify(notifications);
          }
        }

        const participantAtMaxAbsences = absentParticipants.filter(
          (participant) =>
            participant.absenceCount === eventData.absences_limit,
        );

        if (participantAtMaxAbsences.length > 0) {
          for (const participant of participantAtMaxAbsences) {
            const notifications = Notification.create({
              userId: participant.userId,
              eventId: bodyData.eventId,
              message: 'Você atintiu o limite de faltas!',
              type: 'alert' as NotificationTypes,
              sender: SenderTypes.event,
              createdAt: CustomDate.fixTimezoneoffset(new Date()),
              readed: false,
            });
            await this.notificationRepository.notify(notifications);
          }
        }
      }
    }

    const dto = EventLogMapper.toDTO(eventEnded);
    return right(dto);
  }
}
