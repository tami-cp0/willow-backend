import { IsIn, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { ErrorHandler } from '../../utils/errorHandler';

class UpdateOrderStatDto {
	@IsNotEmpty({ message: 'Seller user ID is required' })
	@IsString({ message: 'Seller user ID must be a string' })
	userId!: string;

	@IsNotEmpty({ message: 'Order ID is required' })
	@IsString({ message: 'Order ID must be a string' })
	orderId!: string;

	@IsNotEmpty({ message: 'Status is required' })
	@IsString({ message: 'status must be a string' })
	@IsIn(
		['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'],
		{ message: 'Invalid status' }
	)
	status!: string;

    @IsOptional()
    @IsString({ message: 'Cancel message must be a string'})
    @IsNotEmpty({ message: 'Cancel message is required'})
    @Length(1, 255, { message: 'Cancel message must not exceed 255 characters'})
    cancelMessage?: string
}

async function validateUpdateOrderStatusDto(req: Request): Promise<void> {
	const combinedData = {
        userId: req.params.userId,
        orderId: req.params.orderId,
        status: req.body.status,
        cancelMessage: req.body.cancelMessage,
      };      
	const dtoInstance = plainToInstance(UpdateOrderStatDto, combinedData);
	const errors = await validate(dtoInstance);
	if (errors.length > 0) {
		const firstErrorMessage = Object.values(errors[0].constraints || {})[0];
		throw new ErrorHandler(400, firstErrorMessage);
	}

    if (req.user.id !== req.params.userId) {
        throw new ErrorHandler(403, 'Access denied');
    }
}

export default validateUpdateOrderStatusDto;
