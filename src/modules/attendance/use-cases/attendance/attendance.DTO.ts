import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AttendanceDTOrequest {
  @ApiProperty()
  @IsString()
  userId: string;
  @ApiProperty()
  @IsString()
  eventId: string;
  @ApiProperty()
  @IsString()
  registerEventsId: string;
}
