import { ApiProperty } from '@nestjs/swagger';

export class GetEventByIdDTO {
  @ApiProperty()
  id: string;
}

export class GetEventByIdDTOResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  isPublic: boolean;
  @ApiProperty()
  once: boolean;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  recurrence?: number[];
  @ApiProperty()
  custom_rules: boolean;
  @ApiProperty()
  absences_limit?: boolean;
  @ApiProperty()
  max_absences?: number;
  @ApiProperty()
  delays_limit?: boolean;
  @ApiProperty()
  max_delays?: number;
  @ApiProperty()
  start_date: string | Date;
  @ApiProperty()
  end_date: string | Date;
  @ApiProperty()
  start_time: string | Date;
  @ApiProperty()
  end_time: string | Date;
}
