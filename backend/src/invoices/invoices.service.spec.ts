import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Chance from 'chance';
import { CreateInvoiceInput } from './dto/create-invoice.input';
import { UpdateInvoiceInput } from './dto/update-invoice.input';
import { InvoicesService } from './invoices.service';
import { Invoice } from './entities/invoice.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { DataSource } from 'typeorm';
import { createTestDbConnection } from 'src/common/helper/dbSetup.helper';

jest.setTimeout(20000);

const chance = new Chance();
let invoiceId = -1;

const createInvoiceInput: CreateInvoiceInput = {
  amount: 100,
  from: 'test1@clinify.com',
  to: 'test2@clinify.com',
  description: chance.address(),
  terms: 'Next 30 Days',
  saveAsDraft: 0,
  status: 'Paid',
};

const updateInvoiceInput: UpdateInvoiceInput = {
  id: invoiceId,
  description: chance.name(),
  amount: 200,
  terms: 'Next 30 Days',
};

let userId1 = -1;
const createUserInput1: CreateUserInput = {
  name: chance.name(),
  email: 'test1@clinify.com',
  street: chance.street(),
  city: chance.city(),
  country: chance.country(),
  postcode: chance.postcode(),
};

let userId2 = -1;
const createUserInput2: CreateUserInput = {
  name: chance.name(),
  email: 'test2@clinify.com',
  street: chance.street(),
  city: chance.city(),
  country: chance.country(),
  postcode: chance.postcode(),
};

describe('InvoicesService', () => {
  let service: InvoicesService;
  let usersService: UsersService;
  let module: TestingModule;
  let connection: DataSource;

  beforeAll(async () => {
    connection = await createTestDbConnection([User, Invoice]);

    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          entities: [User, Invoice],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User, Invoice]),
      ],
      providers: [InvoicesService, UsersService],
    })
      .overrideProvider(DataSource)
      .useValue(connection)
      .compile();

    service = module.get<InvoicesService>(InvoicesService);
    usersService = module.get<UsersService>(UsersService);

    const x = await usersService.create(createUserInput1);
    userId1 = x.id;

    const y = await usersService.create(createUserInput2);
    userId2 = y.id;
  });

  afterAll(async () => {
    if (module) {
      if (usersService) {
        await usersService.remove(userId1);
        await usersService.remove(userId2);
      }

      await module.close();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not create an invoice when from or to email does not exist', async () => {
    try {
      await service.createInvoice({
        ...createInvoiceInput,
        from: 'doesnotexist@clinify.com',
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should create an invoice with createInvoiceInput', async () => {
    const invoice = await service.createInvoice(createInvoiceInput);
    expect(invoice.description).toBe(createInvoiceInput.description);
    expect(invoice.amount).toBe(createInvoiceInput.amount);
    expect(invoice.terms).toBe(createInvoiceInput.terms);
    expect(invoice.status).toBe(createInvoiceInput.status);

    invoiceId = invoice.id;
  });

  it('should get a list of invoices', async () => {
    const invoices = await service.findAll();
    expect(invoices).toBeDefined();
    expect(Array.isArray(invoices)).toBe(true);
    expect(invoices.length).toBe(1);
  });

  it('should get the invoice by its own invoiceId', async () => {
    const invoice = await service.findOne(invoiceId);

    expect(invoice.description).toBe(createInvoiceInput.description);
    expect(invoice.amount).toBe(createInvoiceInput.amount);
    expect(invoice.terms).toBe(createInvoiceInput.terms);
    expect(invoice.status).toBe(createInvoiceInput.status);
  });

  it('should update some invoice properties', async () => {
    updateInvoiceInput.id = invoiceId;
    const updatedInvoice = await service.updateInvoice(updateInvoiceInput);
    expect(updatedInvoice.id).toBe(invoiceId);
    expect(updatedInvoice.description).toBe(updateInvoiceInput.description);
    expect(updatedInvoice.amount).toBe(updateInvoiceInput.amount);
  });

  it('should delete the testing invoice', async () => {
    const deletedInvoice = await service.remove(invoiceId);
    expect(deletedInvoice).toBeDefined();
  });

  it('should receive not found error for getting the deleted invoice', async () => {
    try {
      await service.findOne(invoiceId);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('should not be able to update an non existing invoice', async () => {
    try {
      await service.updateInvoice({ ...updateInvoiceInput, id: -1 });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
