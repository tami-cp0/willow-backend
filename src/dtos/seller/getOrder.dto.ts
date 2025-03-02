import { IsNotEmpty, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { ErrorHandler } from '../../utils/errorHandler';

class GetOrderDto {
  @IsNotEmpty({ message: 'Seller user ID is required' })
  @IsString({ message: 'Seller user ID must be a string' })
  userId!: string;

  @IsNotEmpty({ message: 'Order ID is required' })
  @IsString({ message: 'Order ID must be a string' })
  orderId!: string;
}

async function validateGetOrderDto(req: Request): Promise<void> {
  const dtoInstance = plainToInstance(GetOrderDto, req.params);
  const errors = await validate(dtoInstance);
  if (errors.length > 0) {
    const firstErrorMessage = Object.values(errors[0].constraints || {})[0];
    throw new ErrorHandler(400, firstErrorMessage);
  }

  if (req.user.id !== req.params.userId) {
    throw new ErrorHandler(403, 'Access denied');
  }
}

export default validateGetOrderDto;