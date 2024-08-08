import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Controller,
  Get,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/user/use-cases/auth/auth.guard';
import { NotificationDTO } from '../../dtos/notification.DTO';
import { GetUserNotificationsDTO } from './get-user-notifications.DTO';
import { GetUserNotificationsErrors } from './get-user-notifications.errors';
import { GetUserNotificationsUseCase } from './get-user-notifications.useCase';

@ApiTags('Notification')
@Controller('api/v1/notifications')
export class GetUserNotificationsController {
  constructor(private readonly useCase: GetUserNotificationsUseCase) {}

  @ApiOkResponse({
    description: 'Get user notifications',
    type: NotificationDTO,
  })
  @UseGuards(AuthGuard)
  @Get()
  async getUserNotifications(@Req() headerData: GetUserNotificationsDTO) {
    const userId = headerData.userId;

    const result = await this.useCase.execute({ userId });
    if (result.isLeft()) {
      const error = result.value;
      if (error.constructor === GetUserNotificationsErrors.UserNotFound) {
        throw new NotFoundException(error);
      } else {
        throw new BadRequestException(error);
      }
    } else {
      return result.value;
    }
  }
}
