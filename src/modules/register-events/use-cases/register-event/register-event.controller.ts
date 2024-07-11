import {
  BadRequestException,
  ConflictException,
  Controller,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { RegisterEventUseCase } from './register-event.useCase';
import { RegisterEventErrors } from './register-event.errors';
import { RegisterEventsDTO } from '../../dtos/register-events.DTO';
import { RegisterEventDTORequest } from './register-event.DTO';
import { AuthGuard } from 'src/modules/user/use-cases/auth/auth.guard';

@Controller('api/v1/register-event/')
@ApiTags('Register event')
export class RegisterEventController {
  constructor(private readonly useCase: RegisterEventUseCase) {}

  @ApiCreatedResponse({
    description: 'Register event',
    type: RegisterEventsDTO,
  })
  @UseGuards(AuthGuard)
  @Post(':id')
  async registerEvent(@Param() dto: RegisterEventDTORequest) {
    const result = await this.useCase.execute(dto);
    if (result.isLeft()) {
      const error = result.value;
      if (error.constructor === RegisterEventErrors.EventNotExists) {
        throw new ConflictException(error);
      } else {
        throw new BadRequestException(error);
      }
    } else {
      return result.value;
    }
  }
}
