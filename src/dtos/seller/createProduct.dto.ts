import { IsNotEmpty, IsOptional, IsString, Length, IsNumber, IsEnum, IsArray, IsBoolean, IsJSON, validate } from 'class-validator';
import { Packaging, Sourcing, SustainabilityFeature } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ErrorHandler } from '../../utils/errorHandler';
import { Request } from 'express';

class CreateProductDto {
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString({ message: 'Product name must be a string' })
  @Length(1, 50, { message: 'Product name must be between 1 and 50 characters' })
  name!: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @Length(1, 1000, { message: 'Description must be between 1 and 255 characters' })
  description!: string;

  @IsOptional()
  @IsNumber({}, { message: 'inStock must be a number' })
  inStock?: number;

  @IsNotEmpty({ message: 'onDemand is required' })
  @IsBoolean({ message: 'onDemand must be a boolean' })
  onDemand!: boolean;

  @IsNotEmpty({ message: 'Category is required' })
  @IsString({ message: 'Category must be a string' })
  category!: string;

  @IsOptional()
  options?: object;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  price!: number;

  @IsArray({ message: 'Sustainability features must be an array' })
  @IsEnum(SustainabilityFeature, { each: true, message: 'Invalid sustainability feature' })
  sustainabilityFeatures!: SustainabilityFeature[];

  @IsNotEmpty({ message: 'Packaging type is required' })
  @IsEnum(Packaging, { message: 'Invalid packaging type' })
  packaging!: Packaging;

  @IsNotEmpty({ message: 'Sourcing is required' })
  @IsString({ message: 'sourcing must be a string' })
  @IsEnum(Sourcing, { message: 'Invalid sourcing provided'})
  sourcing!: string;

  @IsNotEmpty({ message: 'Seller ID is required' })
  @IsString({ message: 'Seller ID must be a string' })
  userId!: string;
}

async function validateCreateProductDto(req: Request): Promise<void> {
  if (req.user.id !== req.params.userId) {
    throw new ErrorHandler(403, 'Access denied');
  }

  if (!req.files) {
    throw new ErrorHandler(400, 'Product Images are required');
  }

  req.body.onDemand = JSON.parse(req.body.onDemand);
  req.body.price = JSON.parse(req.body.price);
  req.body.inStock = JSON.parse(req.body.inStock);
  req.body.sustainabilityFeatures = JSON.parse(req.body.sustainabilityFeatures);

  if (req.body.onDemand === true) {
    // remove inStock if onDemand is true
    delete req.body.inStock;
  }

  const combinedData = {
    ...req.body,
    userId: req.params.userId
  };
  const dtoInstance = plainToInstance(CreateProductDto, combinedData);
  const errors = await validate(dtoInstance);

  if (errors.length > 0) {
    const firstErrorMessage = Object.values(errors[0].constraints || {})[0];
    throw new ErrorHandler(400, firstErrorMessage);
  }
}

export default validateCreateProductDto;
