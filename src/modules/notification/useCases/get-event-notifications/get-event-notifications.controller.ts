import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Controller,
  Get,
  UseGuards,
  Req,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/user/use-cases/auth/auth.guard';
import { NotificationDTO } from '../../dtos/notification.DTO';
import { GetEventNotificationsHeaderDataDTO } from './get-event-notifications.DTO';
import { GetEventNotificationsErrors } from './get-event-notifications.errors';
import { GetEventNotificationsUseCase } from './get-event-notifications.useCase';

@ApiTags('Notification')
@Controller('api/v1/notifications/event')
export class GetEventNotificationsController {
  constructor(private readonly useCase: GetEventNotificationsUseCase) {}

  @ApiOkResponse({
    description: 'Get event notifications',
    type: NotificationDTO,
  })
  @UseGuards(AuthGuard)
  @Get(':eventId')
  async getEventNotifications(
    @Param('eventId') eventId: string,
    @Req() headerData: GetEventNotificationsHeaderDataDTO,
  ) {
    const userId = headerData.userId;
    const result = await this.useCase.execute(eventId, { userId });
    if (result.isLeft()) {
      const error = result.value;
      if (error.constructor === GetEventNotificationsErrors.EventNotFound) {
        throw new NotFoundException(error);
      } else {
        throw new BadRequestException(error);
      }
    } else {
      return result.value;
    }
  }
}
