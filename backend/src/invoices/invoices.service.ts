import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

    if (createInvoiceInput.saveAsDraft === 1) {
      createInvoiceInput.status = 'Draft';
    }

    const newInvoice = this.invoiceRepository.create({
      amount: createInvoiceInput.amount,
      description: createInvoiceInput.description,
      fromId: from.id,
      toId: to.id,
      terms: createInvoiceInput.terms,
      status: createInvoiceInput.status,
      due_date: due_date.toISOString(),
    });

    return this.invoiceRepository.save(newInvoice);
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceRepository.find();
  }

  async findOne(id: number): Promise<Invoice> {
    return this.invoiceRepository.findOneOrFail({ where: { id } });
  }

  async updateInvoice(
    updateInvoiceInput: UpdateInvoiceInput,
  ): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOneOrFail({
      where: { id: updateInvoiceInput.id },
    });

    const due_date = new Date(invoice.created_at);

    if (updateInvoiceInput.terms)
      switch (updateInvoiceInput.terms) {
        case 'Next 30 Days':
          due_date.setDate(due_date.getDate() + 30);
          break;

        case 'Next 90 Days':
          due_date.setDate(due_date.getDate() + 90);
          break;
      }

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
}
