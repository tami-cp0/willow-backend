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
  import { plainToInstance } from 'class-transformer';
  import { ErrorHandler } from '../../utils/errorHandler';
  
  @ValidatorConstraint({ async: true })
  class ArePasswordsValid implements ValidatorConstraintInterface {
    async validate(newPassword: string, args: ValidationArguments): Promise<boolean> {
      const { confirmNewPassword } = args.object as ResetPasswordDto;
    
      if (newPassword !== confirmNewPassword) return false;
      return true
    }
  
    defaultMessage(): string {
      return 'newPassword and confirmNewPassword do not match';
    }
  }
  
  class ResetPasswordDto {
    @IsNotEmpty({ message: 'newPassword is required' })
    @IsString({ message: 'newPassword must be a string' })
    @MinLength(8, { message: 'newPassword must be at least 8 characters long' })
    newPassword!: string;
  
    @IsNotEmpty({ message: 'confirmNewPassword is required' })
    @IsString({ message: 'confirmNewPassword must be a string' })
    @MinLength(8, { message: 'confirmNewPassword must be at least 8 characters long' })
    @Validate(ArePasswordsValid)
    confirmNewPassword!: string;
  
  }
  
  async function validateResetPasswordDto(req: Request): Promise<void> {
    const dtoInstance = plainToInstance(ResetPasswordDto, req.body);
    const errors = await validate(dtoInstance);
  
    if (errors.length > 0) {
      const firstErrorMessage = Object.values(errors[0].constraints || {})[0];
      throw new ErrorHandler(400, firstErrorMessage);
    }
  }
  
  export default validateResetPasswordDto;
  