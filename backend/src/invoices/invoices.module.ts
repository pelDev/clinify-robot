import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesResolver } from './invoices.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { UsersModule } from 'src/users/users.module';
import { Item } from 'src/items/entities/item.entity';
import { ItemsModule } from 'src/items/items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, Item]),
    UsersModule,
    ItemsModule,
  ],
  providers: [InvoicesService, InvoicesResolver],
})
export class InvoicesModule {}
