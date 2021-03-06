import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import {CreateItemImageDto} from './dto/create-itemImages.dto';
import { UpdateItemDto } from './dto/update-item.dto';

// Repository and Injectable repository
import {Repository} from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';

// enitie
import {Item} from './entities/item.entity'
import {ItemImages} from './entities/itemImages.entity'
@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(ItemImages) private itemImagesRepository: Repository<ItemImages>,
  ){}

  create(createItemDto: CreateItemDto) {
    return this.itemRepository.save(createItemDto);
  }

  public createImage(CreateItemImageDto: CreateItemImageDto) {
    return this.itemImagesRepository.save(CreateItemImageDto);
  }

  public createImageEntity(CreateItemImageDto: CreateItemImageDto) {
    return this.itemImagesRepository.create(CreateItemImageDto);
  }

  public findOneImage(id:string){
    return this.itemImagesRepository.findOne(id)
  }

  // public updateImateFK(id:string, fk:string){
  //   let itemDTO = null
  //   let itemData = this.itemImagesRepository.findOne(fk)
  //   let itemEnitity = this.itemRepository.create()
  //   return this.itemImagesRepository.findOne(id).then(
  //     d => {
  //       d.item = fk
  //     }
  //   )
  // }

  findAll() {
    return this.itemRepository.find();
  }

  findOne(id: string) {
    return `This action returnsa a #${id} item`;
  }

  update(id: string, updateItemDto: UpdateItemDto) {
    return `This action updatesa a #${id} item`;
  }

  remove(id: string) {
    return this.itemRepository.delete(id);
  }
}
