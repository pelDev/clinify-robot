import { Optional } from '@nestjs/common';
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsDefined, IsNumber, IsString } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @IsDefined()
  @IsNumber()
  @Field((_) => Int)
  id: number;

  @Optional()
  @IsString()
  @Field()
  street?: string;

  @Optional()
  @IsString()
  @Field()
  city?: string;

  @Optional()
  @IsString()
  @Field()
  postcode?: string;

  @Optional()
  @IsString()
  @Field()
  country?: string;

  @Optional()
  @IsString()
  @Field()
  name?: string;
}
