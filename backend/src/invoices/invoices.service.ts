import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateItemInput } from 'src/items/dto/update-item.input';
import { Item } from 'src/items/entities/item.entity';
import { ItemsService } from 'src/items/items.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateInvoiceInput } from './dto/create-invoice.input';
import { UpdateInvoiceInput } from './dto/update-invoice.input';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private invoiceRepository: Repository<Invoice>,
    private userService: UsersService,
    private itemService: ItemsService,
  ) {}

  async paid(id: number) {
    const invoice = await this.invoiceRepository.findOneOrFail({
      where: { id },
    });

    return this.invoiceRepository.save({ ...invoice, status: 'Paid' });
  }

  async getUser(id: number) {
    return this.userService.findOne(id);
  }

  async createInvoice(
    createInvoiceInput: CreateInvoiceInput,
  ): Promise<Invoice> {
    const from = await this.userService.findOneByEmail(
      createInvoiceInput.from!,
    );
    const to = await this.userService.findOneByEmail(createInvoiceInput.to!);

    const due_date = new Date();

    switch (createInvoiceInput.terms) {
      case 'Next 30 Days':
        due_date.setDate(due_date.getDate() + 30);
        break;

      case 'Next 90 Days':
        due_date.setDate(due_date.getDate() + 90);
        break;
    }

    if (createInvoiceInput.saveAsDraft) {
      createInvoiceInput.status = 'Draft';
    }

    let newInvoice = this.invoiceRepository.create({
      description: createInvoiceInput.description,
      fromId: from.id,
      toId: to.id,
      terms: createInvoiceInput.terms,
      status: createInvoiceInput.status,
      due_date: due_date.toISOString(),
    });

    newInvoice = await this.invoiceRepository.save(newInvoice);

    const items: Item[] = [];
    let amount = 0;

    for (const item of createInvoiceInput.items) {
      const newItem = await this.itemService.create({
        ...item,
        invoiceId: newInvoice.id,
      });

      amount += item.price * item.quantity;

      items.push(newItem);
    }

    newInvoice.items = items;
    newInvoice.amount = amount;

    return newInvoice;
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceRepository.find();
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found!`);
    }

    let amount = 0;

    for (const item of invoice.items!) {
      amount += item.price * item.quantity;
    }

    invoice.amount = amount;

    return invoice;
  }

  async updateInvoice(
    updateInvoiceInput: UpdateInvoiceInput,
  ): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOneOrFail({
      where: { id: updateInvoiceInput.id },
      relations: ['items'],
    });

    const due_date = new Date(invoice.created_at);

    const removedItems = invoice
      .items!.map((e) => e.id)
      .filter((e) => !updateInvoiceInput.items!.map((e) => e.id).includes(e));

    const items: UpdateItemInput[] = [];

    for (let item of updateInvoiceInput.items!) {
      if (item.id) {
        console.log('Update', item);
        item = await this.itemService.update(item.id, {
          ...item,
        });
      } else {
        item = await this.itemService.create({
          ...item,
          invoiceId: invoice.id,
        });
      }

      items.push(item);
    }

    for (const id of removedItems) {
      await this.itemService.remove(id);
    }

    if (updateInvoiceInput.terms)
      switch (updateInvoiceInput.terms) {
        case 'Next 30 Days':
          due_date.setDate(due_date.getDate() + 30);
          break;

        case 'Next 90 Days':
          due_date.setDate(due_date.getDate() + 90);
          break;
      }

    delete updateInvoiceInput.items;
    delete invoice.items;

    return this.invoiceRepository.save({
      ...invoice,
      ...updateInvoiceInput,
      due_date: due_date.toISOString(),
    });
  }

  async remove(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOneOrFail({
      where: { id },
    });

    const result = await this.invoiceRepository.remove(invoice);

    return { ...result, id };
  }

  async getItems(id: number): Promise<Item[]> {
    return this.itemService.findByInvoice(id);
  }
}
