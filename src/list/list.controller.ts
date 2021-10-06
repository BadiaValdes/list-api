import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto'; // Like Interface but with class
import { UpdateListDto } from './dto/update-list.dto';

// Controls the routes 
// Everything in here will return a value to de user

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  create(@Body() createListDto: CreateListDto) {
    return this.listService.create(createListDto);
  }

  @Get()
  findAll() {
    return this.listService.findAll();
  }

  // URL API TYPE DECORATOR
  @Get([':id']) // User @Param to get URL PARAMS
  findOne(@Param('id') id: string) {
    // + Before a string turn it into a number
    return this.listService.findOne(id);
  }

   // URL API TYPE DECORATOR
   @Get(['bySlug/:slug']) // User @Param to get URL PARAMS
   findOneBySlug(@Param('slug') slug: string) {
     // + Before a string turn it into a number
     return this.listService.findBySlug(slug);
   }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    return this.listService.update(id, updateListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listService.remove(id);
  }
}
