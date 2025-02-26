import { IsEmail, IsNotEmpty, validate, Validate, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
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

class ResendOtpDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  @Validate(IsEmailRegistered)
  email!: string;
}

async function validateResendOtpDto(req: Request): Promise<void> {
  const dtoInstance = plainToInstance(ResendOtpDto, req.body);
  const errors = await validate(dtoInstance);

  if (errors.length > 0) {
    const firstErrorMessage = Object.values(errors[0].constraints || {})[0]; 
    throw new ErrorHandler(400, firstErrorMessage);
  }

}

export default validateResendOtpDto;
