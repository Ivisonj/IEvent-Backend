import { ApiProperty } from '@nestjs/swagger';

export class GetEventNotificationsHeaderDataDTO {
  @ApiProperty()
  userId: string;
}
