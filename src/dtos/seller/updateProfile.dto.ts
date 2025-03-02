import { IsOptional, IsString, Length, validate} from 'class-validator';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { ErrorHandler } from '../../utils/errorHandler';

class UpdateSellerDto {
  @IsOptional()
  @IsString({ message: 'Business name must be a string' })
  @Length(1, 20, { message: 'Business name must not exceed 20 characters'})
  businessName?: string;

  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  @Length(1, 255, { message: 'Bio must not exceed 20 characters'})
  bio?: string;
}

async function validateUpdateSellerDto(req: Request): Promise<void> {
  const dtoInstance = plainToInstance(UpdateSellerDto, req.body);
  const { businessName, bio } = dtoInstance;

  if (!req.file && !businessName && !bio) {
    throw new ErrorHandler(400, 'At least one field (avatar, businessName, or bio) must be provided');
  }

  const errors = await validate(dtoInstance);
  if (errors.length > 0) {
    const firstErrorMessage = Object.values(errors[0].constraints || {})[0];
    throw new ErrorHandler(400, firstErrorMessage);
  }
}

export default validateUpdateSellerDto;
