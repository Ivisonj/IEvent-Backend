import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import {
  GetEventByIdDTO,
  GetEventByIdDTOResponse,
} from './get-event-by-id.DTO';
import { IEventRepository } from '../../repositories/event-repository.interface';
import { GetEventByIdError } from './get-event-by-id.errors';
import { EventMapper } from '../../mappers/event.map';

export type GetEventByIdresponse = Either<
  GetEventByIdError.EventNotExists | Error,
  GetEventByIdDTOResponse[]
>;

@Injectable()
export class GetEventByIdUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  public async execute(
    request: GetEventByIdDTO,
  ): Promise<GetEventByIdresponse> {
    const eventExists = await this.eventRepository.findById(request.id);

    if (!eventExists) return left(new GetEventByIdError.EventNotExists());

    const dto = eventExists.map((event) => EventMapper.toDTO(event));
    return right(dto);
  }
}
