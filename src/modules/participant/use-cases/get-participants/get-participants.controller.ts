import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
} from '@nestjs/common';
import { GetParticipantsUseCase } from './get-participants.useCase';
import {
  GetParticipantsDTORequest,
  GetParticipantsDTOResponse,
} from './get-participants.DTO';
import { GetParticipantsErrors } from './get-participants.errors';

@ApiTags('Participant')
@Controller('api/v1/participants')
export class GetParticipantsController {
  constructor(private readonly useCase: GetParticipantsUseCase) {}

  @ApiOkResponse({
    description: 'Get participants',
    type: GetParticipantsDTOResponse,
  })
  @Get(':eventId')
  async getParticipants(
    @Param('eventId') dto: GetParticipantsDTORequest,
    @Req() request: GetParticipantsDTORequest,
  ) {
    const userId = request.userId;
    dto.userId = userId;
    const result = await this.useCase.execute(dto);
    if (result.isLeft()) {
      const error = result.value;
      if (error.constructor === GetParticipantsErrors.UserOrEventNotMatch) {
        throw new NotFoundException(error);
      } else {
        throw new BadRequestException(error);
      }
    } else {
      return result.value;
    }
  }
}
