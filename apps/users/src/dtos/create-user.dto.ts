import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  name: string;
}
