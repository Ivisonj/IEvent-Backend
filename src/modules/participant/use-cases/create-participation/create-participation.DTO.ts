import { ApiProperty } from '@nestjs/swagger';
import { ParticpantStatus } from '../../domain/participant';

export class CreateParticipantDTOResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  eventId: string;
  @ApiProperty()
  status: ParticpantStatus;
  @ApiProperty()
  presenceCount?: number;
  @ApiProperty()
  lateCount?: number;
  @ApiProperty()
  absenceCount?: number;
}
