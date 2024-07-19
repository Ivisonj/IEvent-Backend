import { ApiProperty } from '@nestjs/swagger';

export class RegisterEventDTORequest {
  @ApiProperty()
  userId: string;
}
