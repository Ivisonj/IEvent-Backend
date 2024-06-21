import { ApiProperty } from '@nestjs/swagger';
import { ParticpantStatus } from '../domain/participant';

export class ParticipantDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  eventId: string;
  @ApiProperty()
  status: ParticpantStatus;
}
