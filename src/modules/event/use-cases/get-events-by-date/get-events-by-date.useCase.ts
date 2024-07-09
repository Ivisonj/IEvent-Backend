import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import {
  GetEventByDateDTOResponse,
  GetEventsByDateDTO,
} from './get-events-by-date.DTO';
import { GetEventsByDateErrors } from './get-events-by-date.errors';
import { IEventRepository } from '../../repositories/event-repository.interface';
import { EventMapper } from '../../mappers/event.map';

export type GetEventsByDateResponse = Either<
  GetEventsByDateErrors.InvalidDate | Error,
  GetEventByDateDTOResponse[]
>;

const date = new Date();
const day = String(date.getDate()).padStart(2, '0');
const month = String(date.getMonth() + 1).padStart(2, '0');
const year = date.getFullYear();
const today = new Date(`${year}-${month}-${day}T23:59:59.000Z`);

@Injectable()
export class GetEventsByDateUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  public async execute(
    request: GetEventsByDateDTO,
    date: string,
  ): Promise<GetEventsByDateResponse> {
    const [year, month, day] = date.split('-');

    const formattedDate = new Date(
      `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T23:59:59.000Z`,
    );

    if (formattedDate < today)
      return left(new GetEventsByDateErrors.InvalidDate());

    const events = await this.eventRepository.findByDate(
      request.userId,
      formattedDate,
    );

    if (!events) return right([]);

    const dto = events.map((event) => EventMapper.toDTO(event));
    return right(dto);
  }
}
