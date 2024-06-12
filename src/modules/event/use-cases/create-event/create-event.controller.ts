import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  ConflictException,
  Controller,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventUseCase } from './create-event.useCase';
import { CreateEventDTO } from './create-event.DTO';
import { EventDTO } from '../../dtos/event.DTO';

@Controller('event')
@ApiTags('Create Event')
export class CreateEventController {
  constructor(private readonly useCase: CreateEventUseCase) {}
  @ApiCreatedResponse({
    description: 'create new event',
    type: EventDTO,
  })
  @Post('create')
  async create(@Body(new ValidationPipe()) dto: CreateEventDTO) {
    const result = await this.useCase.execute(dto);
    if (result.isLeft()) {
      const error = result.value;
      throw new ConflictException(error);
    } else {
      return result.value;
    }
  }
}
