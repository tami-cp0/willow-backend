import { IsEmail, IsNotEmpty, IsString, validate, Validate, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { ErrorHandler } from '../../utils/errorHandler';
import prisma from '../../app';

@ValidatorConstraint({ async: true })
class IsEmailRegistered implements ValidatorConstraintInterface {
  async validate(email: string) {
    if (!email) { return false; }
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    return !!existingUser; // (convert user to true/false) false if email doesn't exist
  }

  defaultMessage() {
    return 'Email is not registered to an account';
  }
}

class CreateUserDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  @Validate(IsEmailRegistered)
  email!: string;

  @IsNotEmpty({ message: 'OTP is required' })
  @IsString({ message: 'Invalid OTP'})
  otp!: string;
}


async function validateVerifyAccountDto(req: Request): Promise<void> {
  const dtoInstance = plainToInstance(CreateUserDto, req.body);
  const errors = await validate(dtoInstance);

  if (errors.length > 0) {
    const firstErrorMessage = Object.values(errors[0].constraints || {})[0]; 
    throw new ErrorHandler(400, firstErrorMessage);
  }

}

export default validateVerifyAccountDto;
