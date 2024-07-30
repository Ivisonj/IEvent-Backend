import { ApiProperty } from '@nestjs/swagger';
import { ParticpantStatus } from '../../domain/participant';

export class ResponseSolicitationHeaderDataDTO {
  @ApiProperty()
  userId: string;
}

export class ResponseSolicitationBodyDataDTO {
  @ApiProperty()
  eventId: string;
  @ApiProperty()
  status: ParticpantStatus;
}

export class ResponseSolicitationDTO {
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
