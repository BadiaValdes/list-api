import { TypeOrmModuleOptions } from "@nestjs/typeorm";

// Entites
import {List} from '../list/entities/list.entity'
import {User} from '../user/entities/user.entity'
import {Item} from '../item/entities/item.entity'
import {ItemImages} from '../item/entities/itemImages.entity'
import {Role} from '../role/entities/role.entity'

export const databaseConection : TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'list_app',
    entities: [User,List,Item,Role,ItemImages],
    synchronize: true,
}

