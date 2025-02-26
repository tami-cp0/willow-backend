import { 
    IsNotEmpty, 
    IsOptional, 
    IsString, 
    Length, 
    validate, 
    Validate, 
    ValidatorConstraint, 
    ValidatorConstraintInterface 
  } from 'class-validator';
  import prisma from '../../app';
import { ErrorHandler } from '../../utils/errorHandler';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
  
  @ValidatorConstraint({ async: true })
  class IsUniqueStorenameConstraint implements ValidatorConstraintInterface {
    async validate(storename: string) {
      if (!storename) { return false; }

      const existingSeller = await prisma.seller.findUnique({
        where: { storename },
      });
      return !existingSeller; // true if username is unique
    }
  
    defaultMessage() {
      return 'Username is already taken';
    }
  }
  
  class CreateSellerDto {
    @IsString({ message: 'Storename must be a string' })
    @IsNotEmpty({ message: 'Storename is required' })
    @Length(3, 20, { message: 'Storename must be between 3 and 20 characters' })
    @Validate(IsUniqueStorenameConstraint)
    storename!: string;
  
    @IsOptional()
    @Length(3, 255, { message: 'Bio must be under 255 characters' })
    @IsString({ message: 'Bio must be a string' })
    bio?: string;
  }
  
async function validateCreateSeller(req: Request): Promise<void> {
    const dtoInstance = plainToInstance(CreateSellerDto, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const firstErrorMessage = Object.values(errors[0].constraints || {})[0];
      throw new ErrorHandler(400, firstErrorMessage);
    }
}

export default validateCreateSeller;