import { IsEmail, IsNotEmpty, IsString, IsOptional, ValidateIf } from 'class-validator';

export class CreateContatoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  // Validate that at least one contact method is provided
  @ValidateIf(() => true)
  validateContactMethods() {
    if (!this.phoneNumber && !this.email) {
      throw new Error('At least one contact method (phone or email) is required');
    }
  }
}
