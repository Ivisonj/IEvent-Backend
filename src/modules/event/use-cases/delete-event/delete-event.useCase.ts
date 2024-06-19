import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import { DeleteEventDTO, DeleteEventDTOResponse } from './delete-event.DTO';
import { IEventRepository } from '../../repositories/event-repository.interface';
import { DeleteEventError } from './delete-event.errors';

export type DeleteEventResponse = Either<
  DeleteEventError.EventNotExists | Error,
  DeleteEventDTOResponse
>;

@Injectable()
export class DeteleEventUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  public async execute(request: DeleteEventDTO): Promise<DeleteEventResponse> {
    const eventExists = await this.eventRepository.exists(request.id);

    if (!eventExists) return left(new DeleteEventError.EventNotExists());

    await this.eventRepository.delete(request.id);

    return right({ message: 'Evento deletado com sucesso' });
  }
}
