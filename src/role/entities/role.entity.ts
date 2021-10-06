import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity()
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type:'varchar', length: 50})
    role: string

    @BeforeInsert()
    toLowerCase(){
        this.role = this.role.toLocaleLowerCase();
    }
}
