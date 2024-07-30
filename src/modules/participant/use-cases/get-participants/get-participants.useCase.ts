import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import {
  GetParticipantsDTOResponse,
  GetParticipantsHeaderDataDTO,
} from './get-participants.DTO';
import { GetParticipantsErrors } from './get-participants.errors';
import { ParticipantMapper } from '../../mappers/participant.map';
import { IParticipantRepository } from '../../repositories/participant-repository.interface';

export type GetParticipantsResponse = Either<
  GetParticipantsErrors.UserOrEventNotMatch | Error,
  GetParticipantsDTOResponse[]
>;

@Injectable()
export class GetParticipantsUseCase {
  constructor(private readonly participantRepository: IParticipantRepository) {}

  public async execute(
    eventId: string,
    headerData: GetParticipantsHeaderDataDTO,
  ): Promise<GetParticipantsResponse> {
    const participants = await this.participantRepository.findParticipants(
      eventId,
      headerData.userId,
    );

    if (!participants)
      return left(new GetParticipantsErrors.UserOrEventNotMatch());

    const dto = participants.map((participant) =>
      ParticipantMapper.toDTO(participant),
    );
    return right(dto);
  }
}
