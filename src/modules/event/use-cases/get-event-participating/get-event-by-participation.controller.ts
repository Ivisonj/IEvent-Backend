import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetEventByParticipationUseCase } from './get-event-by-participation.useCase';
import {
  GetEventByParticipationDTOResponse,
  GetEventsByParticipationDTO,
} from './get-event-by-participation.DTO';
import { GetEventByParticipationErrors } from './get-event-by-participation.errors';
import { AuthGuard } from 'src/modules/user/use-cases/auth/auth.guard';

@ApiTags('Event')
@Controller('api/v1/event/events-by-participation')
export class GetEventByParticipationController {
  constructor(private readonly useCase: GetEventByParticipationUseCase) {}

  @ApiOkResponse({
    description: 'Get event by participation',
    type: GetEventByParticipationDTOResponse,
  })
  @UseGuards(AuthGuard)
  @Get()
  async getEvent(@Req() request: GetEventsByParticipationDTO) {
    const userId = request.userId;
    const dto = { userId };

    const result = await this.useCase.execute(dto);
    if (result.isLeft()) {
      const error = result.value;
      if (error.constructor === GetEventByParticipationErrors.UserNotExists) {
        throw new NotFoundException(error);
      } else {
        throw new BadRequestException(error);
      }
    } else {
      return result.value;
    }
  }
}
