import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import { GetEventByDateDTOResponse } from './get-events-by-date.DTO';
import { GetEventsByDateErrors } from './get-events-by-date.errors';
import { IEventRepository } from '../../repositories/event-repository.interface';
import { EventMapper } from '../../mappers/event.map';

export type GetEventsByDateResponse = Either<
  GetEventsByDateErrors.InvalidDate | Error,
  GetEventByDateDTOResponse[]
>;

const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const today = `${year}-${month}-${day}`;

@Injectable()
export class GetEventsByDateUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  public async execute(date: string): Promise<GetEventsByDateResponse> {
    // if (date < today) return left(new GetEventsByDateErrors.InvalidDate());

    const events = await this.eventRepository.findByDate(date);

    if (!events) return right([]);

    const dto = events.map((event) => EventMapper.toDTO(event));
    return right(dto);
  }
}
