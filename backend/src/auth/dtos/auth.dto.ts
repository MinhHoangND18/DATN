import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '@/base/decorators/common.decorator';
export class LoginDto {
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty({ message: 'tên đăng nhập không được để trống' })
  @Transform(({ value }) => value && value.trim())
  @IsString()
  username: string;

  @ApiProperty({ example: 123123 })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString()
  password: string;
}

export class LoginUserDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  email: string;

  @ApiProperty({ example: 123123 })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString()
  password: string;
}

export class RegisterDto extends LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @Trim()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Trim()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsNotEmpty()
  @Trim()
  @IsString()
  date_of_birth: string;
}
