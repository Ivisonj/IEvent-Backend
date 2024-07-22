import { ApiProperty } from '@nestjs/swagger';

export class StartEventDTORequest {
  @ApiProperty()
  userId: string;
}
