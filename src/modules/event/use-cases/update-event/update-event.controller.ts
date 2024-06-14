import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UpdateEventUseCase } from './update-event.useCase';
import { UpdateEventDTO } from './update-event.DTO';
import { UpdateEventErrors } from './update-event.errors';

@ApiTags('Event')
@Controller('api/v1/event/update/')
export class UpdateEventController {
  constructor(private readonly useCase: UpdateEventUseCase) {}

  @ApiOkResponse({
    description: 'Update Event',
    type: UpdateEventDTO,
  })
  @Put(':id')
  async updateEvent(@Param('id') id: string, @Body() dto: UpdateEventDTO) {
    const result = await this.useCase.execute({ id, ...dto });

    if (result.isLeft()) {
      const error = result.value;
      if (
        error.constructor === UpdateEventErrors.EventNotExists ||
        error.constructor === UpdateEventErrors.FailUpdateEvent
      ) {
        throw new NotFoundException(error);
      } else {
        throw new BadRequestException(error);
      }
    } else {
      return result.value;
    }
  }
}
