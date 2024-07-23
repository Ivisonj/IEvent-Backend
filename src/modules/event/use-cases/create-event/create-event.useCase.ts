import { Injectable } from '@nestjs/common';
import { Event } from '../../domain/Event';
import { IEventRepository } from '../../repositories/event-repository.interface';
import { Either, left, right } from 'src/shared/application/Either';
import { CreateEventDTO } from './create-event.DTO';
import { EventMapper } from '../../mappers/event.map';
import { EventDTO } from '../../dtos/event.DTO';
import { CreateEventErrors } from './create-event.errors';

export type CreateEventResponse = Either<
  CreateEventErrors.InvalidDate | Error,
  EventDTO
>;

@Injectable()
export class CreateEventUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  public async execute(request: CreateEventDTO): Promise<CreateEventResponse> {
    const userExists = await this.eventRepository.userExists(request.userId);

    if (!userExists) return left(new CreateEventErrors.userExists());

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const today = new Date(`${year}-${month}-${day}T23:59:59.000Z`);

    const startDate = new Date(request.start_date);
    const endDate = new Date(request.end_date);

    if (startDate < today || endDate < today)
      return left(new CreateEventErrors.InvalidDate());

    const eventOrError = Event.create({
      userId: request.userId,
      name: request.name,
      address: request.address,
      isPublic: request.isPublic,
      once: request.once,
      isActive: true,
      recurrence: request.recurrence,
      custom_rules: request.custom_rules,
      absences_limit: request.absences_limit,
      max_absences: request.max_absences,
      delays_limit: request.delays_limit,
      max_delays: request.max_delays,
      start_date: startDate,
      end_date: endDate,
      start_time: new Date(request.start_time),
      end_time: new Date(request.end_time),
    });

    const event = await this.eventRepository.create(eventOrError);
    const dto = EventMapper.toDTO(event);
    return right(dto);
  }
}
