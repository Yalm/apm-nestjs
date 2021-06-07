import { IsEmail, IsString, Validate } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  name: string;
}
