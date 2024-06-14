import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import {
  GetEventsByUserIdDTO,
  GetEventsByUserIdDTOResponse,
} from './get-event-by-userId.DTO';
import { IEventRepository } from '../../repositories/event-repository.interface';
import { GetEventsByUserIdErrors } from './get-event-by-userId.errors';
import { EventMapper } from '../../mappers/event.map';

export type GetEventsByUserIdResponse = Either<
  GetEventsByUserIdErrors.EventNotExistsError | Error,
  GetEventsByUserIdDTOResponse[]
>;

@Injectable()
export class GetEventsByUserIdUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  public async execute(
    request: GetEventsByUserIdDTO,
  ): Promise<GetEventsByUserIdResponse> {
    const eventExists = await this.eventRepository.findByUserId(request.userId);

    if (!eventExists)
      return left(new GetEventsByUserIdErrors.EventNotExistsError());

    const dtos = eventExists.map((event) => EventMapper.toDTO(event));
    return right(dtos);
  }
}
