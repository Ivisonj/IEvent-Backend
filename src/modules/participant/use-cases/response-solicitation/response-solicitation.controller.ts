import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseSolicitationUseCase } from './response-solicitation.useCase';
import { ResponseSolicitationErrors } from './response-solicitation.errors';
import {
  ResponseSolicitationDTO,
  ResponseSolicitationBodyDataDTO,
  ResponseSolicitationHeaderDataDTO,
} from './response-solicitation.DTO';
import { AuthGuard } from 'src/modules/user/use-cases/auth/auth.guard';
@ApiTags('Participant')
@Controller('api/v1/response-solicitation/')
export class ResponseSolicitationController {
  constructor(private readonly useCase: ResponseSolicitationUseCase) {}

  @ApiOkResponse({
    description: 'Response solicitation',
    type: ResponseSolicitationDTO,
  })
  @UseGuards(AuthGuard)
  @Put(':solicitationId')
  async ResponseSolicitation(
    @Param('solicitationId') solicitationId: string,
    @Body() bodyData: ResponseSolicitationBodyDataDTO,
    @Req() headerData: ResponseSolicitationHeaderDataDTO,
  ) {
    const userId = headerData.userId;
    const result = await this.useCase.execute(solicitationId, bodyData, {
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;
      if (
        error.constructor === ResponseSolicitationErrors.SolicitationNotFound
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
