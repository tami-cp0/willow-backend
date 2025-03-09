import { IsNotEmpty, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { ErrorHandler } from '../../utils/errorHandler';

class GetProductReviewsDto {
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsString({ message: 'Product ID must be a string' })
  productId!: string;
}

async function validateGetProductReviewsDto(req: Request): Promise<void> {
  const dtoInstance = plainToInstance(GetProductReviewsDto, req.params);
  const errors = await validate(dtoInstance);
  if (errors.length > 0) {
    const firstErrorMessage = Object.values(errors[0].constraints || {})[0];
    throw new ErrorHandler(400, firstErrorMessage);
  }
}

export default validateGetProductReviewsDto;
