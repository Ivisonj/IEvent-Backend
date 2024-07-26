import { ApiProperty } from '@nestjs/swagger';

export class GetParticipantsDTORequest {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  eventId: string;
}

export class GetParticipantsDTOResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  presenceCount?: number;
  @ApiProperty()
  lateCount?: number;
  @ApiProperty()
  absenceCount?: number;
}
