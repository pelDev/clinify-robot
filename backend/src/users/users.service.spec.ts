import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import * as Chance from 'chance';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { createTestDbConnection } from 'src/common/helper/dbSetup.helper';
import { DataSource } from 'typeorm';

const chance = new Chance();
let userId = -1;

const createUserInput: CreateUserInput = {
  name: chance.name(),
  email: chance.email(),
  street: chance.street(),
  city: chance.city(),
  country: chance.country(),
  postcode: chance.postcode(),
};

const updateUserInput: UpdateUserInput = {
  id: userId,
  name: chance.name(),
};

describe('UsersService', () => {
  let service: UsersService;
  let module: TestingModule;
  let connection: DataSource;

  beforeAll(async () => {
    connection = await createTestDbConnection([User]);

    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    })
      .overrideProvider(DataSource)
      .useValue(connection)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user with createUserInput', async () => {
    const user = await service.create(createUserInput);
    expect(user).toEqual({ ...createUserInput, id: expect.any(Number) });
    userId = user.id;
  });

  it('should get a list of users', async () => {
    const users = await service.findAll();
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(1);
    expect(users[0].name).toBe(createUserInput.name);
    expect(users[0].city).toBe(createUserInput.city);
    expect(users[0].email).toBe(createUserInput.email);
    expect(users[0].postcode).toBe(createUserInput.postcode);
    expect(users[0].street).toBe(createUserInput.street);
  });

  it('should get the user by its own userId', async () => {
    const user = await service.findOne(userId);
    expect(user).toEqual({ ...createUserInput, id: userId });
  });

  it('should get the user by its own email', async () => {
    const user = await service.findOneByEmail(createUserInput.email);
    expect(user).toEqual({ ...createUserInput, id: userId });
  });

  it('should update some user properties', async () => {
    updateUserInput.id = userId;
    const updatedUser = await service.update(
      updateUserInput.id,
      updateUserInput,
    );
    expect(updatedUser.id).toBe(userId);
    expect(updatedUser.name).toBe(updateUserInput.name);
  });

  it('should delete the testing user', async () => {
    const deletedUser = await service.remove(userId);
    expect(deletedUser).toBeDefined();
  });

  it('should receive not found error for getting the deleted user', async () => {
    try {
      await service.findOne(userId);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('should not be able to update an non existing user', async () => {
    try {
      await service.update(-1, updateUserInput);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
