import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { FinishEventUseCase } from './finish-event.useCase';
import { FinishEventErrors } from './finish-event.errors';
import { EventLogDTO } from '../../dtos/event-log.DTO';
import {
  FinishEventHeaderDataDTO,
  FinishEventBodyDataDTO,
} from './finish-event.DTO';
import { AuthGuard } from 'src/modules/user/use-cases/auth/auth.guard';

@Controller('api/v1/finish-event/')
@ApiTags('Finish event')
export class FinishEVentController {
  constructor(private readonly useCase: FinishEventUseCase) {}

  @ApiCreatedResponse({
    description: 'Finish event',
    type: EventLogDTO,
  })
  @UseGuards(AuthGuard)
  @Patch(':eventLogId')
  async finishEvent(
    @Param('eventLogId') eventLogId: string,
    @Body() bodyData: FinishEventBodyDataDTO,
    @Req() headerData: FinishEventHeaderDataDTO,
  ) {
    const userId = headerData.userId;
    const result = await this.useCase.execute(eventLogId, bodyData, { userId });
    if (result.isLeft()) {
      const error = result.value;
      if (error.constructor === FinishEventErrors.FailToFinishEvent) {
        throw new ConflictException(error);
      } else {
        throw new BadRequestException(error);
      }
    } else {
      return result.value;
    }
  }
}
