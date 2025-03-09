import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { ErrorHandler } from '../../utils/errorHandler';

class CreateMessageDto {
  @IsNotEmpty({ message: 'Message content is required' })
  @IsString({ message: 'Message content must be a string' })
  content!: string;

  @IsOptional()
  @IsArray({ message: 'Images must be an array' })
  @IsString({ each: true, message: 'Each image must be a string' })
  images?: string[];
}

async function validateCreateMessageDto(req: Request): Promise<void> {
  const dtoInstance = plainToInstance(CreateMessageDto, req.body);
  const errors = await validate(dtoInstance);
  if (errors.length > 0) {
    const firstErrorMessage = Object.values(errors[0].constraints || {})[0];
    throw new ErrorHandler(400, firstErrorMessage);
  }
}

export default validateCreateMessageDto;
