import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateInvoiceInput } from './dto/create-invoice.input';
import { UpdateInvoiceInput } from './dto/update-invoice.input';
import { Invoice } from './entities/invoice.entity';
import { InvoicesService } from './invoices.service';

@Resolver((of) => Invoice)
export class InvoicesResolver {
  constructor(private invoiceService: InvoicesService) {}

  @Query((returns) => [Invoice])
  invoices(): Promise<Invoice[]> {
    return this.invoiceService.findAll();
  }

  @Query((returns) => Invoice)
  getInvoice(@Args('id', { type: () => Int }) id: number): Promise<Invoice> {
    return this.invoiceService.findOne(id);
  }

  @Mutation((returns) => Invoice)
  markAsPaid(@Args('id', { type: () => Int }) id: number): Promise<Invoice> {
    return this.invoiceService.paid(id);
  }

  @Mutation((returns) => Invoice)
  createInvoice(
    @Args('createInvoiceInput') createInvoiceInput: CreateInvoiceInput,
  ): Promise<Invoice> {
    return this.invoiceService.createInvoice(createInvoiceInput);
  }

  @Mutation((returns) => Invoice)
  updateInvoice(
    @Args('updateInvoiceInput') updateInvoiceInput: UpdateInvoiceInput,
  ): Promise<Invoice> {
    return this.invoiceService.updateInvoice(updateInvoiceInput);
  }

  @Mutation(() => Invoice)
  removeInvoice(@Args('id', { type: () => Int }) id: number) {
    return this.invoiceService.remove(id);
  }

  @ResolveField(() => User)
  from(@Parent() invoice: Invoice): Promise<User> {
    return this.invoiceService.getUser(invoice.fromId);
  }

  @ResolveField(() => [Item])
  items(@Parent() invoice: Invoice): Promise<Item[]> {
    return this.invoiceService.getItems(invoice.id);
  }

  @ResolveField(() => User)
  to(@Parent() invoice: Invoice): Promise<User> {
    return this.invoiceService.getUser(invoice.toId);
  }
}
