import {
  BadRequestException,
  ConflictException,
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { StartEventUseCase } from './start-event.useCase';
import { StartEventErrors } from './start-event.errors';
import { EventLogDTO } from '../../dtos/event-log.DTO';
import { StartEventDTORequest } from './start-event.DTO';
import { AuthGuard } from 'src/modules/user/use-cases/auth/auth.guard';

@Controller('api/v1/start-event/')
@ApiTags('Start event')
export class StartEventController {
  constructor(private readonly useCase: StartEventUseCase) {}

  @ApiCreatedResponse({
    description: 'Start event',
    type: EventLogDTO,
  })
  @UseGuards(AuthGuard)
  @Post(':eventId')
  async startEvent(
    @Req() request: StartEventDTORequest,
    @Param('eventId') eventId: string,
  ) {
    const userId = request.userId;
    const result = await this.useCase.execute(eventId, { userId });
    if (result.isLeft()) {
      const error = result.value;
      if (error.constructor === StartEventErrors.EventNotExists) {
        throw new ConflictException(error);
      } else {
        throw new BadRequestException(error);
      }
    } else {
      return result.value;
    }
  }
}
