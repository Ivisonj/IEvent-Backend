import { ApiProperty } from '@nestjs/swagger';

export class EventLogDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  eventId: string;
  @ApiProperty()
  date: string | Date;
  @ApiProperty()
  start_time: string | Date;
  @ApiProperty()
  end_time?: string | Date;
}
