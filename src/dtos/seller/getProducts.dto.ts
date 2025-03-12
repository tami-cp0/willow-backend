import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { ErrorHandler } from '../../utils/errorHandler';

class GetProductsDto {
  @IsNotEmpty({ message: 'Seller user ID is required' })
  @IsString({ message: 'Seller user ID must be a string' })
  userId!: string;

  @IsOptional()
  @IsString({ message: 'Page must be a string' })
  page?: string;

  @IsOptional()
  @IsString({ message: 'Limit must be a string' })
  limit?: string;

  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  @IsIn(['PENDING', 'APPROVED', 'REJECTED', 'OUT_OF_STOCK'], { message: 'Invalid status' })
  status?: string;
}

async function validateGetProductsDto(req: Request): Promise<void> {
  const dtoInstance = plainToInstance(GetProductsDto, {
    userId: req.params.userId,
    page: req.query.page,
    limit: req.query.limit,
    status: req.query.status,
  });
  
  const errors = await validate(dtoInstance);
  if (errors.length > 0) {
    const firstErrorMessage = Object.values(errors[0].constraints || {})[0];
    throw new ErrorHandler(400, firstErrorMessage);
  }
}

export default validateGetProductsDto;
