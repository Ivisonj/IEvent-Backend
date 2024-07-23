import { ApiProperty } from '@nestjs/swagger';

export class UserIdDTO {
  @ApiProperty()
  userId: string;
}

export class EventIdDTO {
  @ApiProperty()
  eventId: string;
}
