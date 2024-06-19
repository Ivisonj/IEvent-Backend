import { AuthGuard } from 'src/modules/user/use-cases/auth/auth.guard';
import {
  BadRequestException,
  Controller,
  Get,
  UseGuards,
  Req,
  NotFoundException,
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
  @UseGuards(AuthGuard)
  @Get()
  async getEvent(@Req() request: GetEventsByUserIdDTO) {
    const userId = request.userId;
    const dto = { userId };

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
