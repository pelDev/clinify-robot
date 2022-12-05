import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsString()
  @Field()
  street: string;

  @IsString()
  @Field()
  city: string;

  @IsNumber()
  @Field()
  postcode: string;

  @IsString()
  @Field()
  country: string;

  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @Field()
  name: string;
}
