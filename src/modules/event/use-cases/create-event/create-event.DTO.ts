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

export class CreateEventDTO {
  @ApiProperty()
  userId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  description: string;

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
  @IsArray()
  recurrence?: number[];

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  custom_rules: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  tolerance_time?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  absences_limit?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  delays_limit?: number;

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
