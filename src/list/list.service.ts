import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

// Repository and Injectable repository
import {Repository} from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';

// Entitie
import {List} from './entities/list.entity'


// Like Angular, a way to access the data

@Injectable()
export class ListService {

  constructor(
    @InjectRepository(List) private listRepository: Repository<List>,
  ){}

  create(createListDto: CreateListDto)  {  
    // Use Save for new elements  
    return this.listRepository.save(this.listRepository.create(createListDto));
  }


  findAll() : Promise<List[]> {
    return this.listRepository.find({ relations: ['items'] });
  }

 public findBySlug(slug: string): Promise<List>{
    return this.listRepository.findOneOrFail({where: {
      slug: slug
    }})
  }

  findOne(id: string) : Promise<List>  {
    return this.listRepository.findOne(id);
  }

  update(id: string, updateListDto: UpdateListDto) {
    return `This action updates a #${id} list`;
  }

  async remove(id: string) {
    let entity = null
    await this.findOne(id).then(d => {
      entity = d
      // if(entity != null)
      // this.listRepository.remove(this.listRepository.create(entity));
    })    
    if(entity != null)
    return this.listRepository.remove(this.listRepository.create(entity));
    else
    return 'no existe la lista'
  }
}
