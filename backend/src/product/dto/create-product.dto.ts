import { ToNumber, Trim } from '@/base/decorators/common.decorator';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({ type: 'string', example: 'Đen' })
  @IsString()
  type: string;

  @ApiProperty({ type: 'number', example: 100 })
  @IsNumber()
  @ToNumber()
  stock: number;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsString()
  @IsOptional()
  image: string;

  @ApiHideProperty()
  @IsNumber()
  @IsOptional()
  @ToNumber()
  id: number;
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  name: string;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  @ToNumber()
  price: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  description: string;

  @ApiProperty()
  @IsPositive()
  @ToNumber()
  @IsNotEmpty()
  category_id: number;

  @ApiProperty({ type: [CreateProductVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants: CreateProductVariantDto[];
}
