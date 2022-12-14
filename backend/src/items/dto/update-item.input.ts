import { CreateItemInput } from './create-item.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsDefined, IsNumber, IsString } from 'class-validator';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @IsDefined()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  id?: number | undefined;

  @IsString()
  @Field()
  name: string;

  @IsNumber()
  @Field(() => Int)
  quantity: number;

  @IsNumber()
  @Field(() => Int)
  price: number;

  @IsNumber()
  @Field(() => Int, { nullable: true })
  invoiceId?: number;
}
