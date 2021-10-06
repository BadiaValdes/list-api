import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, BeforeInsert, ManyToOne, OneToOne } from 'typeorm';

// Entitie
import {Item} from './item.entity'

@Entity()
export class ItemImages {
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @Column({type:'varchar', nullable: true})
    relativePath: string

    @Column({type:'varchar',  nullable: true})
    originalName: string

    @Column({type:'varchar',  nullable: true})
    largeName: string


    @Column({type:'varchar',  nullable: true})
    mediumName: string


    @Column({type:'varchar',  nullable: true})
    thumbnailName: string



    
   
}
