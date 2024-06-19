import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import { UpdateEventDTO } from './update-event.DTO';
import { IEventRepository } from '../../repositories/event-repository.interface';
import { UpdateEventErrors } from './update-event.errors';
import { EventMapper } from '../../mappers/event.map';
import { Event } from '../../domain/Event';

export type UpdateEventResponse = Either<
  UpdateEventErrors.EventNotExists | Error,
  UpdateEventDTO
>;

@Injectable()
export class UpdateEventUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  public async execute(
    id: string,
    request: UpdateEventDTO,
  ): Promise<UpdateEventResponse> {
    const eventExists = await this.eventRepository.exists(id);

    if (!eventExists) {
      return left(new UpdateEventErrors.EventNotExists());
    }

    const updateEventOrError = Event.create(
      {
        userId: request.userId,
        name: request.name,
        address: request.address,
        isPublic: request.isPublic,
        once: request.once,
        isActive: request.isActive,
        recurrence: request.recurrence,
        custom_rules: request.custom_rules,
        absences_limit: request.absences_limit,
        max_absences: request.max_absences,
        delays_limit: request.delays_limit,
        max_delays: request.max_delays,
        start_date: request.start_date,
        end_date: request.end_date,
        start_time: request.start_time,
        end_time: request.end_time,
      },
      request.id,
    );

    const event = await this.eventRepository.update(
      request.id,
      updateEventOrError,
    );
    const dto = EventMapper.toDTO(event);
    return right(dto);
  }
}
