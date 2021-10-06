import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entites
import {Item} from './entities/item.entity'
import {ItemImages} from './entities/itemImages.entity'
import {List} from '../list/entities/list.entity'
@Module({
  imports: [TypeOrmModule.forFeature([Item, ItemImages])], // Put the Tables that will be used in this module 
  controllers: [ItemController],
  providers: [ItemService]
})
export class ItemModule {}
