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
  GetEventsByDateErrors.UserNotExists | Error,
  GetEventByDateDTOResponse[]
>;

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

    const userExists = await this.eventRepository.userExists(request.userId);

    if (!userExists) return left(new GetEventsByDateErrors.UserNotExists());

    const events = await this.eventRepository.findByDate(
      request.userId,
      formattedDate,
    );

    if (!events) return right([]);

    const dto = events.map((event) => EventMapper.toDTO(event));
    return right(dto);
  }
}
