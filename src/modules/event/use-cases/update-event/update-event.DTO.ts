import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateEventDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  once: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  recurrence?: number[];

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  custom_rules: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  absences_limit?: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  max_absences?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  delays_limit?: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  max_delays?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  start_date: string | Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  end_date: string | Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  start_time: string | Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  end_time: string | Date;
}
