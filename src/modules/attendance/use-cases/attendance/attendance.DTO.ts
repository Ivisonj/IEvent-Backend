import { ApiProperty } from '@nestjs/swagger';

export class AttendanceHeaderDataDTO {
  @ApiProperty()
  userId: string;
}

export class AttendanceBodyDataDTO {
  @ApiProperty()
  eventId: string;
  @ApiProperty()
  eventLogId: string;
}
