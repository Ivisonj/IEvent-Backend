import { ApiProperty } from '@nestjs/swagger';

export class GetUserNotificationsDTO {
  @ApiProperty()
  userId: string;
}
