import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import { RegisterEvents } from '../../domain/register-events';
import { IRegisterEventsRepository } from '../../repositories/register-events-repository.interface';
import { RegisterEventDTORequest } from './register-event.DTO';
import { RegisterEventErrors } from './register-event.errors';
import { RegisterEventsMapper } from '../../mappers/register-events.map';
import { RegisterEventsDTO } from '../../dtos/register-events.DTO';
import { CustomDate } from 'src/shared/application/customDate';

export type RegisterEventResponse = Either<
  RegisterEventErrors.EventNotExists | Error,
  RegisterEventsDTO
>;

@Injectable()
export class RegisterEventUseCase {
  constructor(
    private readonly registerEventRepository: IRegisterEventsRepository,
  ) {}

  public async execute(
    eventId: string,
    userId: RegisterEventDTORequest,
  ): Promise<RegisterEventResponse> {
    const eventExists = await this.registerEventRepository.eventExists(eventId);

    if (!eventExists) return left(new RegisterEventErrors.EventNotExists());

    const isUserEventCreator =
      await this.registerEventRepository.isUserEventCreator(
        eventId,
        userId.userId,
      );

    if (!isUserEventCreator)
      return left(new RegisterEventErrors.FailToStartEvent());

    const eventStarted =
      await this.registerEventRepository.eventStarted(eventId);

    if (eventStarted) return left(new RegisterEventErrors.FailSolicitation());

    const currentDate = CustomDate.customHours(new Date());

    const eventDateMatch = await this.registerEventRepository.checkDate(
      eventId,
      currentDate,
    );

    if (!eventDateMatch)
      return left(new RegisterEventErrors.EventCanNotStartToday());

    const registerEventOrError = RegisterEvents.create({
      eventId: eventId,
      date: currentDate,
      start_time: new Date(),
      end_time: null,
    });

    const event =
      await this.registerEventRepository.create(registerEventOrError);
    const dto = RegisterEventsMapper.toDTO(event);
    return right(dto);
  }
}
