import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetEventsByUserIdUseCase } from './get-event-by-userId.useCase';
import {
  GetEventsByUserIdDTO,
  GetEventsByUserIdDTOResponse,
} from './get-event-by-userId.DTO';
import { GetEventsByUserIdErrors } from './get-event-by-userId.errors';

@ApiTags('Event')
@Controller('api/v1/event/events-by-user-id')
export class GetEventsByUserIdController {
  constructor(private readonly useCase: GetEventsByUserIdUseCase) {}

  @ApiOkResponse({
    description: 'Get event by user id',
    type: GetEventsByUserIdDTOResponse,
  })
  @Get(':userId')
  async getEvent(@Param() dto: GetEventsByUserIdDTO) {
    const result = await this.useCase.execute(dto);
    if (result.isLeft()) {
      const error = result.value;
      if (error.constructor === GetEventsByUserIdErrors.EventNotExistsError) {
        throw new NotFoundException(error);
      } else {
        throw new BadRequestException(error);
      }
    } else {
      return result.value;
    }
  }
}
