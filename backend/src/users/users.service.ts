import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
// import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(createUserInput: CreateUserInput) {
    const newUser = this.userRepository.create(createUserInput);

    return this.userRepository.save(newUser);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneOrFail({ where: { id } });
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneOrFail({ where: { email } });
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    const user = await this.userRepository.findOneOrFail({
      where: { id },
    });

    return this.userRepository.save({
      ...user,
      ...updateUserInput,
    });
  }

  async remove(id: number) {
    const invoice = await this.userRepository.findOneOrFail({
      where: { id },
    });

    const result = await this.userRepository.remove(invoice);

    return { ...result, id };
  }
}
