import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseSolicitationUseCase } from './response-solicitation.useCase';
import { ResponseSolicitationErrors } from './response-solicitation.errors';
import { ResponseSolicitationDTO } from './response-solicitation.DTO';
import { ParticpantStatus } from '../../domain/participant';
@ApiTags('Participant')
@Controller('api/v1/participant/response-solicitation/')
export class ResponseSolicitationController {
  constructor(private readonly useCase: ResponseSolicitationUseCase) {}

  @ApiOkResponse({
    description: 'Response solicitation',
    type: ResponseSolicitationDTO,
  })
  @Put(':id')
  async ResponseSolicitation(
    @Param('id') id: string,
    @Body() status: { status: ParticpantStatus },
  ) {
    const result = await this.useCase.execute(id, status.status);

    if (result.isLeft()) {
      const error = result.value;
      if (
        error.constructor === ResponseSolicitationErrors.SolicitationNotExists
      ) {
        throw new NotFoundException(error);
      } else {
        throw new BadRequestException(error);
      }
    } else {
      return result.value;
    }
  }
}
