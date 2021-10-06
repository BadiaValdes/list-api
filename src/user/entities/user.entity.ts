import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, BeforeInsert } from 'typeorm';
const dbcrypt = require('bcrypt');

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({length: 30, unique: true})
    userName: string

    @Column({select: false})
    password: string

    @Column({length: 30})
    firstName: string

    @Column({length: 30})
    lastName: string

    @Column({default: false})
    isStaff: boolean
    
    @Column({default: false})
    isSuperUser: boolean

    @Column({default: true})
    isActive: boolean

    @Column({ type: 'timestamptz',  default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date

    @Column({ type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
    lastLogin: Date

    @BeforeInsert()
    async encryptPassword(){
        const salt = await dbcrypt.genSalt();
        this.password = await dbcrypt.hash(this.password, salt)
    }

    async validatePassword(password: string): Promise<boolean>{
        return await dbcrypt.compare(password, this.password)
    }

}
