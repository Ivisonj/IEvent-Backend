import { ApiProperty } from '@nestjs/swagger';

export class FinishEventDTORequest {
  @ApiProperty()
  userId: string;
}
