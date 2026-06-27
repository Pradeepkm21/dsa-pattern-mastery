import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ProgressStatus } from '@prisma/client';

export class UpdateProgressDto {
  @IsEnum(ProgressStatus, { message: 'Invalid progress status' })
  status!: ProgressStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  confidenceLevel?: number;

  @IsOptional()
  @IsString()
  dryRunNotes?: string;

  @IsOptional()
  @IsString()
  whyNotes?: string;

  @IsOptional()
  @IsString()
  freeNotes?: string;
}
