import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetEventByIdUseCase } from './get-event-by-id.useCase';
import {
  GetEventByIdDTO,
  GetEventByIdDTOResponse,
} from './get-event-by-id.DTO';
import { GetEventByIdError } from './get-event-by-id.errors';

@ApiTags('Event')
@Controller('api/v1/event/events-by-id')
export class GetEventByIdController {
  constructor(private readonly useCase: GetEventByIdUseCase) {}

  @ApiOkResponse({
    description: 'Get event by id',
    type: GetEventByIdDTOResponse,
  })
  @Get(':id')
  async getEventById(@Param() dto: GetEventByIdDTO) {
    const result = await this.useCase.execute(dto);
    if (result.isLeft()) {
      const error = result.value;
      if (error.constructor === GetEventByIdError.EventNotExists) {
        throw new NotFoundException(error);
      } else {
        throw new BadRequestException(error);
      }
    } else {
      return result.value;
    }
  }
}
