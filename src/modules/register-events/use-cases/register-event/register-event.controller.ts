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
import { RegisterEventUseCase } from './register-event.useCase';
import { RegisterEventErrors } from './register-event.errors';
import { RegisterEventsDTO } from '../../dtos/register-events.DTO';
import { RegisterEventDTORequest } from './register-event.DTO';
import { AuthGuard } from 'src/modules/user/use-cases/auth/auth.guard';

@Controller('api/v1/start-event/')
@ApiTags('Register event')
export class RegisterEventController {
  constructor(private readonly useCase: RegisterEventUseCase) {}

  @ApiCreatedResponse({
    description: 'Register event',
    type: RegisterEventsDTO,
  })
  @UseGuards(AuthGuard)
  @Post(':id')
  async registerEvent(
    @Req() request: RegisterEventDTORequest,
    @Param('id') eventId: string,
  ) {
    const userId = request.userId;
    const result = await this.useCase.execute(eventId, { userId });
    if (result.isLeft()) {
      const error = result.value;
      if (
        error.constructor === RegisterEventErrors.EventNotExists ||
        RegisterEventErrors.EventCanNotStartToday ||
        RegisterEventErrors.FailToStartEvent
      ) {
        throw new ConflictException(error);
      } else {
        throw new BadRequestException(error);
      }
    } else {
      return result.value;
    }
  }
}
