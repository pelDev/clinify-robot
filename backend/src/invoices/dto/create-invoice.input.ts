import { Optional } from '@nestjs/common';
import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsIn,
  IsString,
} from 'class-validator';
import { CreateItemInput } from 'src/items/dto/create-item.input';

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

  // @Optional()
  // @IsNumber()
  // @Field((type) => Int, { defaultValue: 0 })
  // amount: number;

  @IsDefined()
  @IsArray()
  @Field(() => [CreateItemInput])
  items: CreateItemInput[];

  @Optional()
  @IsBoolean()
  @Field(() => Boolean, { defaultValue: false })
  saveAsDraft?: boolean;
}
