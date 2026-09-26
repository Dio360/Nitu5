import { IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreateVehicleDto {
  @IsString()
  @MaxLength(40)
  make!: string;

  @IsString()
  @MaxLength(40)
  model!: string;

  @IsString()
  @MaxLength(30)
  colour!: string;

  @IsString()
  @MaxLength(20)
  plate!: string;

  @IsString()
  @MaxLength(30)
  category!: string;

  @IsInt()
  @Min(1)
  seats!: number;

  @IsOptional()
  photos?: string[];
}

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  colour?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  seats?: number;

  @IsOptional()
  photos?: string[];
}
