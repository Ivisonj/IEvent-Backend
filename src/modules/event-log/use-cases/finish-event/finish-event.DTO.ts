import { ApiProperty } from '@nestjs/swagger';

export class FinishEventHeaderDataDTO {
  @ApiProperty()
  userId: string;
}
