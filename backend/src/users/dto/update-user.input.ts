import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @IsString()
  @Field()
  street: string;

  @IsString()
  @Field()
  city: string;

  @IsString()
  @Field()
  postcode: string;

  @IsString()
  @Field()
  country: string;

  @IsString()
  @Field()
  name: string;
}
