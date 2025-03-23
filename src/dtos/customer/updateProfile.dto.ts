import { IsOptional, IsString, IsNotEmpty, IsObject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { ErrorHandler } from '../../utils/errorHandler';

class UpdateCustomerProfileDto {
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  firstname?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  lastname?: string;

  @IsOptional()
  @IsObject({ message: 'Address must be a valid JSON object' })
  address?: object;
}

async function validateUpdateCustomerProfileDto(req: Request): Promise<void> {
    if (req.user.id !== req.params.userId) {
        throw new ErrorHandler(403, 'Access denied');
      }
      
  // Validate the request body against the DTO
  const dtoInstance = plainToInstance(UpdateCustomerProfileDto, req.body);
  const errors = await validate(dtoInstance);
  
  if (errors.length > 0) {
    const firstErrorMessage = Object.values(errors[0].constraints || {})[0];
    throw new ErrorHandler(400, firstErrorMessage);
  }

  // Ensure that at least one field is provided
  if (!dtoInstance.firstname && !dtoInstance.lastname && !dtoInstance.address) {
    throw new ErrorHandler(400, 'At least one field (firstname, lastname, or address) must be provided');
  }
}

export default validateUpdateCustomerProfileDto;
