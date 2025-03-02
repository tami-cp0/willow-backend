import { IsIn, IsOptional, IsString, validate } from 'class-validator';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { ErrorHandler } from '../../utils/errorHandler';

class GetOrdersDto {
    @IsOptional()
    @IsString({ message: 'status must be a string' })
    @IsIn(['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'], { message: 'Invalid status' })
    status?: string;
  
    @IsOptional()
    @IsString({ message: 'page must be a string' })
    page?: string;
  
    @IsOptional()
    @IsString({ message: 'limit must be a string' })
    limit?: string;
  }
  
  async function validateGetOrdersDto(req: Request): Promise<void> {
    const dtoInstance = plainToInstance(GetOrdersDto, {
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit,
    });
  
    const errors = await validate(dtoInstance);
  
    if (errors.length > 0) {
      const firstErrorMessage = Object.values(errors[0].constraints || {})[0];
      throw new ErrorHandler(400, firstErrorMessage);
    }

    if (req.user.id !== req.params.userId) {
        throw new ErrorHandler(403, 'Access denied');
    }
  }
  
export default validateGetOrdersDto;
