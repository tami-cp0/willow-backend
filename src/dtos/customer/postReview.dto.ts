import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { ErrorHandler } from '../../utils/errorHandler';

class PostReviewDto {
	@IsNotEmpty({ message: 'Customer user ID is required' })
	@IsString({ message: 'Customer user ID must be a string' })
	userId!: string;

	@IsNotEmpty({ message: 'Product ID is required' })
	@IsString({ message: 'Product ID must be a string' })
	productId!: string;

	@IsNotEmpty({ message: 'Order ID is required' })
	@IsString({ message: 'Order ID must be a string' })
	orderId!: string;

	@IsNotEmpty({ message: 'Rating is required' })
	@IsInt({ message: 'Rating must be an integer' })
	@Min(1, { message: 'Rating must be at least 1' })
	@Max(5, { message: 'Rating must be no more than 5' })
	rating!: number;

	@IsString({ message: 'Comment must be a string' })
	comment?: string;
}

async function validatePostReviewDto(req: Request): Promise<void> {
	if (req.user.id !== req.params.userId) {
		throw new ErrorHandler(403, 'Access denied');
	}

    const dtoInstance = plainToInstance(PostReviewDto, {
		userId: req.params.userId,
		productId: req.params.productId,
		orderId: req.body.orderId,
		rating: req.body.rating,
		comment: req.body.comment,
	});

	const errors = await validate(dtoInstance);
	if (errors.length > 0) {
		const firstErrorMessage = Object.values(errors[0].constraints || {})[0];
		throw new ErrorHandler(400, firstErrorMessage);
	}
}

export default validatePostReviewDto;
