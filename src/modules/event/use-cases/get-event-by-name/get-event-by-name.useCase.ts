import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import {
  GetEventByNameDTO,
  GetEventByNameDTOResponse,
} from './get-event-by-name.DTO';
import { IEventRepository } from '../../repositories/event-repository.interface';
import { GetEventByNameErrors } from './get-event-by-name.errors';
import { EventMapper } from '../../mappers/event.map';

export type GetEventByNameResponse = Either<
  GetEventByNameErrors.EventNotExists | Error,
  GetEventByNameDTOResponse[]
>;

@Injectable()
export class GetEventByNameUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  public async execute(
    request: GetEventByNameDTO,
  ): Promise<GetEventByNameResponse> {
    const eventExists = await this.eventRepository.findByName(request.name);

    if (!eventExists) return left(new GetEventByNameErrors.EventNotExists());

    const dto = eventExists.map((event) => EventMapper.toDTO(event));
    return right(dto);
  }
}
