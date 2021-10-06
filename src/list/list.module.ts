import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entitie
import {List} from './entities/list.entity'
import {Item} from '../item/entities/item.entity'

// Modules
import {ItemModule} from '../item/item.module'
import {UserModule} from '../user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([List]), ItemModule, UserModule], // Put the Tables that will be used in this module 
  controllers: [ListController],
  providers: [ListService]
})
export class ListModule {}
