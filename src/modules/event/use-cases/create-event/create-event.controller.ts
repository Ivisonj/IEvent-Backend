import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/user/use-cases/auth/auth.guard';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  ValidationPipe,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateEventUseCase } from './create-event.useCase';
import { CreateEventDTO } from './create-event.DTO';
import { EventDTO } from '../../dtos/event.DTO';
import { CreateEventErrors } from './create-event.errors';

@Controller('api/v1/event/')
@ApiTags('Create Event')
export class CreateEventController {
  constructor(private readonly useCase: CreateEventUseCase) {}
  @ApiCreatedResponse({
    description: 'create new event',
    type: EventDTO,
  })
  @UseGuards(AuthGuard)
  @Post('create')
  async create(
    @Req() request,
    @Body(new ValidationPipe()) eventDTO: CreateEventDTO,
  ) {
    const userId = request.userId;
    const dto = { userId, ...eventDTO };

    const result = await this.useCase.execute(dto);
    if (result.isLeft()) {
      const error = result.value;
      if (error.constructor === CreateEventErrors.userExists) {
        throw new ConflictException(error);
      } else {
        throw new BadRequestException(error);
      }
    } else {
      return result.value;
    }
  }
}
