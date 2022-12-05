import { Optional } from '@nestjs/common';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDefined, IsEmail, IsIn, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateInvoiceInput {
  @IsDefined()
  @IsEmail()
  @Field()
  from: string;

  @IsDefined()
  @IsEmail()
  @Field()
  to: string;

  @IsDefined()
  @IsIn(['Next 30 Days', 'Next 90 Days'])
  @Field()
  terms: 'Next 30 Days' | 'Next 90 Days';

  @IsString()
  @Field()
  description: string;

  @Optional()
  @IsIn(['Pending', 'Paid', 'Draft'])
  @Field({ defaultValue: 'Pending' })
  status: 'Pending' | 'Paid' | 'Draft';

  @Optional()
  @IsNumber()
  @Field((type) => Int, { defaultValue: 0 })
  amount: number;

  @Optional()
  @IsNumber()
  @IsIn([0, 1])
  @Field((_) => Int, { defaultValue: 0 })
  saveAsDraft: number;
}
