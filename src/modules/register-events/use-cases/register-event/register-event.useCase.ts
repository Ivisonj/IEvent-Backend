import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import { RegisterEvents } from '../../domain/register-events';
import { IRegisterEventsRepository } from '../../repositories/register-events-repository.interface';
import { RegisterEventDTORequest } from './register-event.DTO';
import { RegisterEventErrors } from './register-event.errors';
import { RegisterEventsMapper } from '../../mappers/register-events.map';
import { RegisterEventsDTO } from '../../dtos/register-events.DTO';

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
    request: RegisterEventDTORequest,
  ): Promise<RegisterEventResponse> {
    const eventExists = await this.registerEventRepository.eventExists(
      request.id,
    );

    if (!eventExists) return left(new RegisterEventErrors.EventNotExists());

    const date = new Date();

    const eventDateMatch = await this.registerEventRepository.checkDate(
      request.id,
      date,
    );

    if (!eventDateMatch)
      return left(new RegisterEventErrors.EventCanNotStart());

    const registerEventOrError = RegisterEvents.create({
      eventId: request.id,
      date: date,
      start_time: new Date(),
      end_time: undefined,
    });

    const event =
      await this.registerEventRepository.create(registerEventOrError);
    const dto = RegisterEventsMapper.toDTO(event);
    return right(dto);
  }
}
