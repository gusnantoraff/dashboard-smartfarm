import { IsBoolean, IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMembershipDto {
  @IsUUID()
  cluster_id: string;

  @IsUUID()
  user_id: string;

  @IsBoolean()
  is_owner: boolean;

  @IsBoolean()
  is_first_owner: boolean;

  @IsBoolean()
  is_active: boolean;

  @IsString()
  invited_by: string;

  invited_at: Date;

  @IsString()
  status: string;
}