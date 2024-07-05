import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import {
  GetEventByParticipationDTOResponse,
  GetEventsByParticipationDTO,
} from './get-event-by-participation.DTO';
import { GetEventByParticipationErrors } from './get-event-by-participation.errors';
import { EventMapper } from '../../mappers/event.map';
import { IEventRepository } from '../../repositories/event-repository.interface';

export type GetEventByParticipationResponse = Either<
  GetEventByParticipationErrors.UserNotExists | Error,
  GetEventByParticipationDTOResponse[]
>;

@Injectable()
export class GetEventByParticipationUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  public async execute(
    request: GetEventsByParticipationDTO,
  ): Promise<GetEventByParticipationResponse> {
    const userExists = await this.eventRepository.userExists(request.userId);

    if (!userExists)
      return left(new GetEventByParticipationErrors.UserNotExists());

    const events = await this.eventRepository.findByParticipation(
      request.userId,
    );

    if (!events) return right([]);

    const dto = events.map((event) => EventMapper.toDTO(event));
    return right(dto);
  }
}
