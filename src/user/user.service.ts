import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Repository
import {Repository} from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';

// Entitei
import {User} from './entities/user.entity'

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private userRepository: Repository<User>,){}

  create(createUserDto: CreateUserDto) {
    // The this.userRepository.create(dto) creates an entiti
    return this.userRepository.save(this.userRepository.create(createUserDto));
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
