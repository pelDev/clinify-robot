import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsDefined, IsNumber, IsString } from 'class-validator';
import { UpdateItemInput } from 'src/items/dto/update-item.input';

@InputType()
export class UpdateInvoiceInput {
  @IsDefined()
  @IsNumber()
  @Field((_) => Int)
  id: number;

  @IsDefined()
  @Field()
  terms: 'Next 30 Days' | 'Next 90 Days';

  @IsDefined()
  @IsString()
  @Field()
  description: string;

  @IsDefined()
  @IsArray()
  @Field(() => [UpdateItemInput], { nullable: true })
  items?: UpdateItemInput[];
}
