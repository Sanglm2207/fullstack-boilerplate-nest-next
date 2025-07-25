import { IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  product: string;

  @IsString()
  category: string;

  @IsNumber()
  price: number;
}