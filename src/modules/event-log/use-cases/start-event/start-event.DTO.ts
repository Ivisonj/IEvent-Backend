import { ApiProperty } from '@nestjs/swagger';

export class StartEventHeaderDataDTO {
  @ApiProperty()
  userId: string;
}
