import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Chance from 'chance';
import { createTestDbConnection } from 'src/common/helper/dbSetup.helper';
import { CreateInvoiceInput } from 'src/invoices/dto/create-invoice.input';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { InvoicesService } from 'src/invoices/invoices.service';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { DataSource } from 'typeorm';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';

const chance = new Chance();
let itemId = -1;
let invoiceId = -1;

const createInvoiceInput: CreateInvoiceInput = {
  from: 'test1@clinify.com',
  to: 'test2@clinify.com',
  description: chance.address(),
  terms: 'Next 30 Days',
  saveAsDraft: false,
  status: 'Paid',
  items: [],
};

let userId1: number;
const createUserInput1: CreateUserInput = {
  name: chance.name(),
  email: 'test1@clinify.com',
  street: chance.street(),
  city: chance.city(),
  country: chance.country(),
  postcode: chance.postcode(),
};

let userId2: number;
const createUserInput2: CreateUserInput = {
  name: chance.name(),
  email: 'test2@clinify.com',
  street: chance.street(),
  city: chance.city(),
  country: chance.country(),
  postcode: chance.postcode(),
};

const createItemInput: CreateItemInput = {
  name: chance.name(),
  price: 12,
  quantity: 1,
  invoiceId,
};

const updateItemInput: UpdateItemInput = {
  id: itemId,
  name: chance.name(),
  price: 12,
  quantity: 1,
  invoiceId,
};

describe('ItemsService', () => {
  let service: ItemsService;
  let invoicesService: InvoicesService;
  let usersService: UsersService;
  let module: TestingModule;
  let connection: DataSource;

  beforeAll(async () => {
    connection = await createTestDbConnection([Invoice, Item, User]);

    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          entities: [Invoice, Item, User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Invoice, Item, User]),
      ],
      providers: [ItemsService, InvoicesService, UsersService],
    })
      .overrideProvider(DataSource)
      .useValue(connection)
      .compile();

    service = module.get<ItemsService>(ItemsService);
    invoicesService = module.get<InvoicesService>(InvoicesService);
    usersService = module.get<UsersService>(UsersService);

    const x = await usersService.create(createUserInput1);
    userId1 = x.id;

    const y = await usersService.create(createUserInput2);
    userId2 = y.id;

    const invoice = await invoicesService.createInvoice({
      ...createInvoiceInput,
      from: x.email,
      to: y.email,
    });

    invoiceId = invoice.id;
  });

  afterAll(async () => {
    if (module) {
      if (invoicesService) {
        await invoicesService.remove(invoiceId);
      }

      if (usersService) {
        await usersService.remove(userId1);
        await usersService.remove(userId2);
      }

      await module.close();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(invoicesService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  it('should create an item with createItemInput', async () => {
    const item = await service.create({ ...createItemInput, invoiceId });
    expect(item).toBeDefined();
    expect(item).toEqual({
      ...createItemInput,
      id: expect.any(Number),
      invoiceId,
    });
    itemId = item.id;
  });

  it('should get a list of items', async () => {
    const items = await service.findAll();
    expect(items).toBeDefined();
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBe(1);
    expect(items[0].name).toBe(createItemInput.name);
    expect(items[0].price).toBe(createItemInput.price);
    expect(items[0].quantity).toBe(createItemInput.quantity);
  });

  it('should get the item by its own itemId', async () => {
    const item = await service.findOne(itemId);
    expect(item).toEqual({ ...createItemInput, id: itemId, invoiceId });
  });

  it('should update some item properties', async () => {
    updateItemInput.id = itemId;
    const updatedItem = await service.update(
      updateItemInput.id,
      updateItemInput,
    );
    expect(updatedItem.id).toBe(itemId);
    expect(updatedItem.name).toBe(updateItemInput.name);
  });

  it('should delete the testing item', async () => {
    const deletedItem = await service.remove(itemId);
    expect(deletedItem).toBeDefined();
  });

  it('should receive not found error for getting the deleted item', async () => {
    try {
      await service.findOne(itemId);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('should not be able to update an non existing item', async () => {
    try {
      await service.update(-1, updateItemInput);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
