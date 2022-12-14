import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
  ) {}

  create(createItemInput: CreateItemInput) {
    const newItem = this.itemRepository.create(createItemInput);

    return this.itemRepository.save(newItem);
  }

  findAll() {
    return this.itemRepository.find();
  }

  async findOne(id: number) {
    const item = await this.itemRepository.findOne({ where: { id } });

    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found!`);
    }

    return item;
  }

  async findByInvoice(id: number) {
    return this.itemRepository.find({ where: { invoiceId: id } });
  }

  async update(id: number, updateItemInput: UpdateItemInput) {
    const item = await this.findOne(id);

    console.log('Update', item);

    return this.itemRepository.save({
      ...item,
      ...updateItemInput,
      invoiceId: item.invoiceId,
    });
  }

  async remove(id: number) {
    const item = await this.findOne(id);

    const result = await this.itemRepository.remove(item);

    return { ...result, id };
  }
}
