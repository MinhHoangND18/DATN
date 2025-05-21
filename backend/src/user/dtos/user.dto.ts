import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// SHARED
import { ListDto } from '@/shared/dtos/common.dto';
import { EGender } from '../user.constant';
import { ToNumber, Trim } from '@/base/decorators/common.decorator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value && value.trim())
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value && value.trim())
  password: string;
}

export class ListUserDto extends ListDto {}

export class UploadAvatarDto {
  @ApiProperty({ required: false })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  @IsOptional()
  file: string;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value && value.trim())
  full_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value && value.trim())
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value && value.trim())
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value && value.trim())
  email: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsEnum(EGender)
  @Trim()
  gender: EGender;

  @ApiProperty()
  @IsString()
  birthday: string;
}
