import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FinishEventHeaderDataDTO {
  @ApiProperty()
  userId: string;
}

export class FinishEventBodyDataDTO {
  @ApiProperty()
  @IsNotEmpty()
  eventId: string;
}
