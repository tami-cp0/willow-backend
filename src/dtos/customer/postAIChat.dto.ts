import { IsNotEmpty, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { ErrorHandler } from '../../utils/errorHandler';

class PostAIChatDto {
	// From URL params:
	@IsNotEmpty({ message: 'Customer user ID is required' })
	@IsString({ message: 'Customer user ID must be a string' })
	userId!: string;

	// From body:
	@IsNotEmpty({ message: 'User query is required' })
	@IsString({ message: 'User query must be a string' })
	userQuery!: string;
}

async function validatePostAIChatDto(req: Request): Promise<void> {
	if (req.user.id !== req.params.userId) {
		throw new ErrorHandler(403, 'Access denied');
	}

	const dtoInstance = plainToInstance(PostAIChatDto, {
		userId: req.params.userId,
		userQuery: req.body.userQuery,
	});
	const errors = await validate(dtoInstance);
	if (errors.length > 0) {
		const firstErrorMessage = Object.values(errors[0].constraints || {})[0];
		throw new ErrorHandler(400, firstErrorMessage);
	}
}

export default validatePostAIChatDto;
