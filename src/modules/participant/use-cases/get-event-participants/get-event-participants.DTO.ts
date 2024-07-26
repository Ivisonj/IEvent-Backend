import { ApiProperty } from '@nestjs/swagger';

export class GetEventParticipantsDTORequest {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  eventId: string;
}

export class GetEventParticipantsDTOResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
}
