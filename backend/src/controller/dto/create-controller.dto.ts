import { IsString, IsUUID, IsInt, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateControllerDto {
  @IsUUID()
  @IsNotEmpty()
  cluster_id: string;

  @IsUUID()
  @IsNotEmpty()
  template_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  dap_count: number;

  @IsBoolean()
  is_active: boolean;
}
