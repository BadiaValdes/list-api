import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ListModule } from './list/list.module';

// Type ORM
import {TypeOrmModule} from '@nestjs/typeorm'


// DatabaseConfig
import {databaseConection} from './database/db_config'

// TypeORM Connection
import { Connection } from 'typeorm';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { RoleModule } from './role/role.module';


// Entites for DB
// Put in for ROOT if the db config is hardcode in here
// Put in the config file

@Module({
  imports: [ListModule,TypeOrmModule.forRoot(databaseConection), UserModule, ItemModule, RoleModule,],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {
  constructor(private connection : Connection){}
}
