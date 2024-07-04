import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import { ResponseSolicitationDTO } from './response-solicitation.DTO';
import { IParticipantRepository } from '../../repositories/participant-repository.interface';
import { ResponseSolicitationErrors } from './response-solicitation.errors';
import { ParticipantMapper } from '../../mappers/participant.map';
import { ParticpantStatus } from '../../domain/participant';

export type ResponseSolicitationResponse = Either<
  ResponseSolicitationErrors.SolicitationNotExists | Error,
  ResponseSolicitationDTO
>;

@Injectable()
export class ResponseSolicitationUseCase {
  constructor(private readonly participantRepository: IParticipantRepository) {}

  public async execute(
    id: string,
    status: ParticpantStatus,
  ): Promise<ResponseSolicitationResponse> {
    const solicitationExists = await this.participantRepository.exists(id);

    if (!solicitationExists)
      return left(new ResponseSolicitationErrors.SolicitationNotExists());

    const updatedParticipant = await this.participantRepository.updateStatus(
      id,
      status,
    );

    if (!updatedParticipant && status === ParticpantStatus.rejected) {
      return right(null);
    }

    if (!updatedParticipant) {
      return left(new Error('Failed to update status'));
    }

    const dto = ParticipantMapper.toDTO(updatedParticipant);
    return right(dto);
  }
}
