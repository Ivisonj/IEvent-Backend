import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetEventsByDateUseCase } from './get-events-by-date.useCase';
import { GetEventByDateDTOResponse } from './get-events-by-date.DTO';
import { GetEventsByDateErrors } from './get-events-by-date.errors';

@ApiTags('Event')
@Controller('api/v1/event/events-by-date')
export class GetEventByDateController {
  constructor(private readonly useCase: GetEventsByDateUseCase) {}

  @ApiOkResponse({
    description: 'Get event by date',
    type: GetEventByDateDTOResponse,
  })
  @Get()
  async getEventsByDate(@Query('date') date: string) {
    const result = await this.useCase.execute(date);
    if (result.isLeft()) {
      const error = result.value;
      if (error.constructor === GetEventsByDateErrors.InvalidDate) {
        throw new NotFoundException(error);
      } else {
        throw new BadRequestException(error);
      }
    } else {
      return result.value;
    }
  }
}
