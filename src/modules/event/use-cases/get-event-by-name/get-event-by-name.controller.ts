import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetEventByNameUseCase } from './get-event-by-name.useCase';
import {
  GetEventByNameDTO,
  GetEventByNameDTOResponse,
} from './get-event-by-name.DTO';
import { GetEventByNameErrors } from './get-event-by-name.errors';

@ApiTags('Event')
@Controller('api/v1/event/events-by-name')
export class GetEventByNameController {
  constructor(private readonly useCase: GetEventByNameUseCase) {}

  @ApiOkResponse({
    description: 'Get event by name',
    type: GetEventByNameDTOResponse,
  })
  @Get(':name')
  async getEventByName(@Param() dto: GetEventByNameDTO) {
    const result = await this.useCase.execute(dto);
    if (result.isLeft()) {
      const error = result.value;
      if (error.constructor === GetEventByNameErrors.EventNotExists) {
        throw new NotFoundException(Error);
      } else {
        throw new BadRequestException(error);
      }
    } else {
      return result.value;
    }
  }
}
