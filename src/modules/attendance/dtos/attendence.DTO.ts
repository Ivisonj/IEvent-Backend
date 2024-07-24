import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '../domain/attendance';

export class AttendanceDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  eventId: string;
  @ApiProperty()
  registerEventsId: string;
  @ApiProperty()
  checkedInAt: string | Date;
  @ApiProperty()
  status: AttendanceStatus;
}
