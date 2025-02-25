import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, Validate, validate } from 'class-validator';
import { Role } from '@prisma/client';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import prisma from '../../app';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { ErrorHandler } from '../../utils/errorHandler';
import validateCreateSeller from './createSeller.dto';
import validateCreateCustomer from './createCustomer.dto';

@ValidatorConstraint({ async: true })
class IsUniqueEmail implements ValidatorConstraintInterface {
  async validate(email: string) {
    if (!email) { return false; }
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    return !existingUser; // true if email doesn't exist
  }

  defaultMessage() {
    return 'Email is already in use';
  }
}

class CreateUserDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  @Validate(IsUniqueEmail)
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  // add check for admin. no one can register as admin (temp)
  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(Role, { message: 'Role must be one of CUSTOMER, SELLER, ADMIN' })
  role!: Role;
}

const roleValidators: Record<string, (req: Request) => Promise<void>> = {
  CUSTOMER: validateCreateCustomer,
  SELLER: validateCreateSeller,
};


async function validateCreateUserDto(req: Request): Promise<void> {
  const dtoInstance = plainToInstance(CreateUserDto, req.body);
  const errors = await validate(dtoInstance);

  if (errors.length > 0) {
    const firstErrorMessage = Object.values(errors[0].constraints || {})[0]; 
    throw new ErrorHandler(400, firstErrorMessage);
  }

  await roleValidators[req.body.role](req);
}

export default validateCreateUserDto;
