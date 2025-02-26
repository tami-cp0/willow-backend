import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    validate,
    Validate,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  import { Request } from 'express';
  import bcrypt from 'bcryptjs';
  import { plainToInstance } from 'class-transformer';
  import { ErrorHandler } from '../../utils/errorHandler';
  import prisma from '../../app';
  
  @ValidatorConstraint({ async: true })
  class IsPasswordOrEmailValid implements ValidatorConstraintInterface {
    async validate(password: string, args: ValidationArguments): Promise<boolean> {
      const { email } = args.object as LoginDto;
    
      if (!email || !password) return false;
  
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return false;

      return bcrypt.compare(password, user.password as string);
    }
  
    defaultMessage(): string {
      return 'Invalid email or password';
    }
  }
  
  class LoginDto {
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email address' })
    email!: string;
  
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @Validate(IsPasswordOrEmailValid)
    password!: string;
  
  }
  
  async function validateLoginDto(req: Request): Promise<void> {
    const dtoInstance = plainToInstance(LoginDto, req.body);
    const errors = await validate(dtoInstance);
  
    if (errors.length > 0) {
      const firstErrorMessage = Object.values(errors[0].constraints || {})[0];
      throw new ErrorHandler(400, firstErrorMessage);
    }
  }
  
  export default validateLoginDto;
  