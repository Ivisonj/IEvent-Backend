import { Injectable } from '@nestjs/common';
import { Event } from '../../domain/event';
import { IEventRepository } from '../../repositories/event-repository.interface';
import { Either, right } from 'src/shared/application/Either';
import { CreateEventDTO } from './create-event.DTO';
import { EventMapper } from '../../mappers/event.map';
import { EventDTO } from '../../dtos/event.DTO';

export type CreateEventResponse = Either<Error, EventDTO>;

@Injectable()
export class CreateEventUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  public async execute(request: CreateEventDTO): Promise<CreateEventResponse> {
    const eventOrError = Event.create({
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
    });

    const event = await this.eventRepository.create(eventOrError);
    const dto = EventMapper.toDTO(event);
    return right(dto);
  }
}
