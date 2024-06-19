import { ApiProperty } from '@nestjs/swagger';

export class DeleteEventDTO {
  @ApiProperty()
  id: string;
}

export class DeleteEventDTOResponse {
  @ApiProperty()
  message: string;
}
