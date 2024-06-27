import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Controller,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateParticipantUseCase } from './create-participation.useCase';
import { ParticipantDTO } from '../../dtos/participant.DTO';
import { AuthGuard } from 'src/modules/user/use-cases/auth/auth.guard';
import { CreateParticipantErrors } from './create-participation.errors';

@ApiTags('Participation')
@Controller('api/v1/solicitation')
export class CreateParticipantController {
  constructor(private readonly useCase: CreateParticipantUseCase) {}
  @ApiCreatedResponse({
    description: 'create solicitation',
    type: ParticipantDTO,
  })
  @UseGuards(AuthGuard)
  @Post(':eventId')
  async createParticipation(@Req() request, @Param('eventId') eventId: string) {
    const userId = request.userId;

    const result = await this.useCase.execute(userId, eventId);

    if (result.isLeft()) {
      const error = result.value;
      if (
        error.constructor === CreateParticipantErrors.UserNotExists ||
        error.constructor === CreateParticipantErrors.EventNotExists
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
