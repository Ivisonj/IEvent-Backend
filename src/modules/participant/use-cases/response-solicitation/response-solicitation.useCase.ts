import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/shared/application/Either';
import {
  ResponseSolicitationDTO,
  ResponseSolicitationBodyDataDTO,
  ResponseSolicitationHeaderDataDTO,
} from './response-solicitation.DTO';
import { IParticipantRepository } from '../../repositories/participant-repository.interface';
import { ResponseSolicitationErrors } from './response-solicitation.errors';
import { ParticipantMapper } from '../../mappers/participant.map';
import { ParticpantStatus } from '../../domain/participant';

export type ResponseSolicitationResponse = Either<
  ResponseSolicitationErrors.SolicitationNotFound | Error,
  ResponseSolicitationDTO
>;

@Injectable()
export class ResponseSolicitationUseCase {
  constructor(private readonly participantRepository: IParticipantRepository) {}

  public async execute(
    solicitationId: string,
    bodyData: ResponseSolicitationBodyDataDTO,
    headerData: ResponseSolicitationHeaderDataDTO,
  ): Promise<ResponseSolicitationResponse> {
    const solicitationExists =
      await this.participantRepository.exists(solicitationId);

    if (!solicitationExists)
      return left(new ResponseSolicitationErrors.SolicitationNotFound());

    const isEventCreator = await this.participantRepository.isEventCreator(
      bodyData.eventId,
      headerData.userId,
    );

    if (!isEventCreator)
      return left(
        new ResponseSolicitationErrors.YouNotHavePermissionToAcceptThisSolicitation(),
      );

    const updatedParticipant = await this.participantRepository.updateStatus(
      solicitationId,
      bodyData.status,
    );

    if (!updatedParticipant && bodyData.status === ParticpantStatus.rejected) {
      return right(null);
    }

    if (!updatedParticipant)
      return left(new ResponseSolicitationErrors.FailToUpdateStatus());

    const dto = ParticipantMapper.toDTO(updatedParticipant);
    return right(dto);
  }
}
