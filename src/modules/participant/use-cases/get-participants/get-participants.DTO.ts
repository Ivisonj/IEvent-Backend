import { ApiProperty } from '@nestjs/swagger';

export class GetParticipantsHeaderDataDTO {
  @ApiProperty()
  userId: string;
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
