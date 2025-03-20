import { IsNotEmpty, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { ErrorHandler } from '../../utils/errorHandler';

class DeleteReviewDto {
	@IsNotEmpty({ message: 'Customer user ID is required' })
	@IsString({ message: 'Customer user ID must be a string' })
	userId!: string;

	@IsNotEmpty({ message: 'Product ID is required' })
	@IsString({ message: 'Product ID must be a string' })
	productId!: string;

	@IsNotEmpty({ message: 'Review ID is required' })
	@IsString({ message: 'Review ID must be a string' })
	reviewId!: string;
}

async function validateDeleteReviewDto(req: Request): Promise<void> {
	if (req.user.id !== req.params.userId) {
		throw new ErrorHandler(403, 'Access denied');
	}

	const dtoInstance = plainToInstance(DeleteReviewDto, req.params);
	const errors = await validate(dtoInstance);
	if (errors.length > 0) {
		const firstErrorMessage = Object.values(errors[0].constraints || {})[0];
		throw new ErrorHandler(400, firstErrorMessage);
	}
}

export default validateDeleteReviewDto;
