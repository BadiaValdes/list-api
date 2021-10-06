import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, BeforeInsert, OneToMany } from 'typeorm';

// Entitie
import {Item} from '../../item/entities/item.entity'
// Like Model in DJANGO
// Create the DB
@Entity()
export class List {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length:30})
    name: string;

    @Column({length: 255})
    description: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({length:30, type:'varchar', nullable: true})
    slug?: string

    @OneToMany(() => Item, item => item.list, {eager: true})
    items: Item[];

    @BeforeInsert()
    createSlug(){
        let txt = ""
        for (let char of this.name)
        {
            if(char == " ")
            {
                txt += "_"
            }
            else
            txt += char
        }
        this.slug = txt.toLocaleLowerCase();
    }
}
