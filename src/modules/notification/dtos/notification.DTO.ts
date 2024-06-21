import { ApiProperty } from '@nestjs/swagger';
import { NotificationTypes } from '../domain/notification';

export class NotificationDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  eventId: string;
  @ApiProperty()
  message?: string;
  @ApiProperty()
  type: NotificationTypes;
  @ApiProperty()
  createdAt: string | Date;
  @ApiProperty()
  readed: boolean;
}
