import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, BeforeInsert, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

// Entitie
import {List} from '../../list/entities/list.entity'
import {ItemImages} from './itemImages.entity'

@Entity()
export class Item {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length: 50, unique: true, type:'varchar'})
    itemName: string

    @Column({default: 0})
    itemStars: number

    // Item Photo
    @Column({nullable: true})
    imageUpload: string

    @Column({length:255, type: 'varchar'})
    description: string

    // Delete on cascada goes here
    @ManyToOne(()=> List, list => list.items, {onDelete: "CASCADE", cascade: true})
    list: List;

    // One To One
    @OneToOne(()=> ItemImages, {onDelete: "CASCADE", eager: true})
    image: ItemImages
}
