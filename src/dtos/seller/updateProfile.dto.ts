import { IsNotEmpty, IsOptional, IsString, Length, validate} from 'class-validator';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { ErrorHandler } from '../../utils/errorHandler';

class UpdateSellerDto {
  @IsNotEmpty({ message: 'Seller user ID is required' })
    @IsString({ message: 'Seller user ID must be a string' })
    userId!: string;

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
  const dtoInstance = plainToInstance(UpdateSellerDto, {
      userId: req.params.userId,
      bio: req.body.bio,
      businessName: req.body.businessName,
    });
  const { businessName, bio } = dtoInstance;

  if (req.user.id !== req.params.userId) {
    throw new ErrorHandler(403, 'Access denied');
  }

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
