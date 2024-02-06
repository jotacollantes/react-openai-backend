import { IsInt, IsOptional, IsString } from 'class-validator';
export class OrthographyDto {
  //Pipes
  @IsString()
  readonly prompt: string;
  //Pipes
  @IsInt()
  @IsOptional()
  readonly maxTokens?: number;
}
