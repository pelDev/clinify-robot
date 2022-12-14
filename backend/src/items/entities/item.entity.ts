import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  quantity: number;

  @Column({ type: 'int' })
  @Field(() => Int)
  price: number;

  @Column()
  @Field(() => Int)
  invoiceId: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.items, { onDelete: 'CASCADE' })
  @Field(() => Invoice)
  invoice?: Invoice;
}
