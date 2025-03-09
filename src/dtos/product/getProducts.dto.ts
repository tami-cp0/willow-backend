import { IsOptional, IsString, IsIn } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { ErrorHandler } from '../../utils/errorHandler';

class GetAllProductsDto {
  @IsOptional()
  @IsString({ message: 'Page must be a string' })
  page?: string;

  @IsOptional()
  @IsString({ message: 'Limit must be a string' })
  limit?: string;

  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  @IsIn(['PENDING', 'APPROVED', 'REJECTED'], { message: 'Invalid status' })
  status?: string;
}

async function validateGetAllProductsDto(req: Request): Promise<void> {
  const dtoInstance = plainToInstance(GetAllProductsDto, {
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

export default validateGetAllProductsDto;
