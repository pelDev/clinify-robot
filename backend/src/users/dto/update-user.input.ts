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
  @Field({ nullable: true })
  street?: string;

  @Optional()
  @IsString()
  @Field({ nullable: true })
  city?: string;

  @Optional()
  @IsString()
  @Field({ nullable: true })
  postcode?: string;

  @Optional()
  @IsString()
  @Field({ nullable: true })
  country?: string;

  @Optional()
  @IsString()
  @Field({ nullable: true })
  name?: string;
}
