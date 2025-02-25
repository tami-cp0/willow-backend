import {
	IsNotEmpty,
	IsString,
	IsObject,
	IsOptional,
	ValidateNested,
	Length,
	validate,
} from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';
import { ErrorHandler } from '../../utils/errorHandler';
import { Request } from 'express';

class AddressDto {
	@IsString({ message: 'Country must be a string' })
	@IsNotEmpty({ message: 'Country is required' })
	country!: string;

	@IsString({ message: 'State must be a string' })
	@IsNotEmpty({ message: 'State is required' })
	state!: string;

	@IsString({ message: 'Address line 1 must be a string' })
	@IsNotEmpty({ message: 'Address line 1 is required' })
	address1!: string;

	@IsOptional()
	@IsString({ message: 'Address line 2 must be a string' })
	address2?: string;

	@IsOptional()
	@IsString({ message: 'Zipcode must be a string' })
	@Length(5, 10, { message: 'Invalid Zipcode' })
	zipcode?: string;
}

class CreateCustomerDto {
	@IsString({ message: 'Firstname must be a string' })
	@IsNotEmpty({ message: 'First name is required' })
	firstname!: string;

	@IsString({ message: 'Lastname must be a string' })
	@IsNotEmpty({ message: 'Last name is required' })
	lastname!: string;
}

async function validateCreateCustomer(req: Request): Promise<void> {
	const dtoInstance = plainToInstance(CreateCustomerDto, req.body);
	const errors = await validate(dtoInstance);

	if (errors.length > 0) {
		const firstErrorMessage = Object.values(errors[0].constraints || {})[0];
		throw new ErrorHandler(400, firstErrorMessage);
	}
}

export default validateCreateCustomer;
