import { Optional } from '@nestjs/common';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDefined, IsNumber, IsString } from 'class-validator';

@InputType()
export class UpdateInvoiceInput {
  @IsDefined()
  @IsNumber()
  @Field((_) => Int)
  id: number;

  @Optional()
  @Field()
  terms: 'Next 30 Days' | 'Next 90 Days';

  @Optional()
  @IsString()
  @Field()
  description: string;

  @Optional()
  @IsNumber()
  @Field((type) => Int, { defaultValue: 0 })
  amount: number;
}
