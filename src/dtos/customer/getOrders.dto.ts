import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { ErrorHandler } from '../../utils/errorHandler';

class GetCustomerOrdersDto {
	@IsNotEmpty({ message: 'Customer user ID is required' })
	@IsString({ message: 'Customer user ID must be a string' })
	userId!: string;

	@IsOptional()
	@IsString({ message: 'Transaction status must be a string' })
	@IsIn(['SUCCESS', 'FAILED'], {
		message: 'Transaction status must be FAILED or SUCCESS',
	})
	transactionStatus?: string;
}

async function validateGetCustomerOrdersDto(req: Request): Promise<void> {
	if (req.user.id !== req.params.userId) {
		throw new ErrorHandler(403, 'Access denied');
	}

	const dtoInstance = plainToInstance(GetCustomerOrdersDto, {
		userId: req.params.userId,
		transactionStatus: req.query.transactionStatus,
	});
	const errors = await validate(dtoInstance);
	if (errors.length > 0) {
		const firstErrorMessage = Object.values(errors[0].constraints || {})[0];
		throw new ErrorHandler(400, firstErrorMessage);
	}
}

export default validateGetCustomerOrdersDto;
