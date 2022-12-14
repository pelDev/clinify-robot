import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
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
