import {
  BadRequestException,
  Controller,
  Delete,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DeteleEventUseCase } from './delete-event.useCase';
import { DeleteEventDTOResponse } from './delete-event.DTO';
import { DeleteEventError } from './delete-event.errors';

@ApiTags('Event')
@Controller('api/v1/event')
export class DeleteEventController {
  constructor(private readonly useCase: DeteleEventUseCase) {}

  @ApiOkResponse({
    description: 'Delete event',
    type: DeleteEventDTOResponse,
  })
  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    const result = await this.useCase.execute({ id });
    if (result.isLeft()) {
      const error = result.value;
      if (error.constructor === DeleteEventError.EventNotExists) {
        throw new NotFoundException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    } else {
      return result;
    }
  }
}
