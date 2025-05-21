import { ToNumber, Trim } from '@/base/decorators/common.decorator';
import { ERole } from '@/role/enum/roles.enum';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { EGender } from '../user.constant';

export class CmsCreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ERole)
  @Trim()
  role: ERole;

  @ApiProperty()
  @IsString()
  full_name: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsEnum(EGender)
  @Trim()
  gender: EGender;

  @ApiProperty()
  @IsString()
  birthday: string;

  @ApiProperty()
  @IsString()
  address: string;
}

export class CmsUpdateUserDto extends PartialType(CmsCreateUserDto) {}

export class ActiveUserDto {
  @ApiProperty()
  @IsNotEmpty()
  active: string;
}
