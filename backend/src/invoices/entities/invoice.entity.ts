import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Invoice {
  @PrimaryGeneratedColumn()
  @Field((_) => Int)
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @Field(() => User)
  from: User;

  @Column()
  @Field(() => Int)
  fromId: number;

  @ManyToOne(() => User, (user) => user.id)
  @Field(() => User)
  to: User;

  @Column()
  @Field(() => Int)
  toId: number;

  @Column({ enum: ['Next 30 Days', 'Next 90 Days'], enumName: 'invoice_terms' })
  @Field({ defaultValue: 'Next 30 Days' })
  terms: 'Next 30 Days' | 'Next 90 Days';

  @Column()
  @Field()
  description: string;

  @Column({ enum: ['Pending', 'Paid', 'Draft'], enumName: 'invoice_status' })
  @Field({ defaultValue: 'Draft' })
  status: 'Pending' | 'Paid' | 'Draft';

  // @Column({ type: 'int' })
  @Field((_) => Int, { defaultValue: 0 })
  amount?: number;

  @Column({ type: 'date', default: 'NOW()' })
  @Field()
  due_date: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'NOW()',
  })
  @Field()
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'NOW()',
    onUpdate: 'NOW()',
  })
  @Field()
  updated_at: Date;

  @OneToMany(() => Item, (item) => item.invoice)
  @Field(() => [Item])
  items?: Item[];
}
