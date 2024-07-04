import { ApiProperty } from '@nestjs/swagger';
import { ParticpantStatus } from '../../domain/participant';

export class ResponseSolicitationDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  eventId: string;
  @ApiProperty()
  status: ParticpantStatus;
}
