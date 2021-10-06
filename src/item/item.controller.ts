import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Res,
  StreamableFile,
  Req,
  Query,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { CreateItemImageDto } from './dto/create-itemImages.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Observable, of } from 'rxjs';
import { join } from 'path';
import * as fileS from 'fs';
import { readFile } from 'fs';

// multer Sharp
//import * as MulterSharp from 'multer-sharp-resizer'
import * as sharp from 'sharp';
const MulterSharp = require('multer-sharp-resizer');

import { promisify } from 'util';
const readFileAsyc = promisify(readFile); // Turn readFile into a promise

// Image
import {
  FileInterceptor,
  FilesInterceptor,
  AnyFilesInterceptor,
} from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';

import path = require('path');
import { createReadStream } from 'fs';

export const image_destination_path = './uploads/item-images';

// Disk Sotrage, use for sharp
export const storageDisk = {
  storage: diskStorage({
      destination: image_destination_path,
      filename: (req, file, cb) => {
          const filename: string = path.parse(file.originalname).name.replace(" ", '_');
          const extension: string = path.parse(file.originalname).ext;          
          cb(null, `${filename}${extension}`)
      }
  })

}

// User for mutter sharp
export const storage = {
  storage: memoryStorage(),
};

export const sizes = [
  { path: 'original', width: null, height: null },
  {
    path: 'large',
    width: 800,
    height: 800,
  },
  {
    path: 'medium',
    width: 300,
    height: 300,
  },
  {
    path: 'thumbnail',
    width: 100,
    height: 100,
  },
];

export const uploadResizeImageSecondTest = async (
  file: Express.Multer.File,
  ext,
  req,
) => {
  const resizeOBJ = new MulterSharp();

  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, '0');

  const filename = `gallery-${Date.now()}.jpeg`;

  let path = join(image_destination_path, year.toString(), month.toString());
  const sharpOptions = {
    fit: 'contain',
    background: { r: 255, g: 255, b: 255 }, 
    
      quality: 1
      
  };
  resizeOBJ.req = req;
  resizeOBJ.filename = file.originalname.split('.')[0];
  resizeOBJ.sizes = sizes;
  resizeOBJ.uploadPath = path;
  resizeOBJ.fileUrl = path;
  resizeOBJ.sharpOptions = sharpOptions;

  console.log(resizeOBJ)

  resizeOBJ.resize();

  return resizeOBJ.getData();
};

export const uploadResizeImage = async (file: Express.Multer.File, ext) => {
  // My size

  sizes.forEach((object) => {
    let size = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');
  
    const filename = `gallery-${Date.now()}.jpeg`;
  
    let path = join(image_destination_path, year.toString(), month.toString());
    

    size.push(+object.width);
    size.push(+object.height);
    console.log(size);
    let fileName = file.originalname.split('.');
    let j = readFileAsyc(file.path)
      .then((b: Buffer) => {
        return sharp(b)
          .resize(+object.width, +object.height, {fit:'cover'}) // You can puth directly the width and height
          .toFile(
            join(
              process.cwd(),
              path +
                '/' +
                fileName[0] +
                '.' +
                object.path +
                '.' +
                'png',
            ),
          );
      })
      .then(console.log)
      .catch(console.error);
      return j;
  });
};
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @UseInterceptors(FileInterceptor('imageUpload', storage))
  @Post()
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createItemDto: CreateItemDto,
    @Req() req,
  ) {
    //return this.itemService.create(createItemDto);

    // console.log(file)
    const [, ext] = file.mimetype.split('/');
    //uploadResizeImage(file, ext);
    let z = null;
    let data = uploadResizeImageSecondTest(file, ext, req);
    //let data = (file,ext)
    await data.then((d) => {
      z = d;
    });

    console.log(z);

    let createItemImageDto: CreateItemImageDto;
    let jj = this.itemService.createImageEntity(createItemImageDto);

    jj.largeName = z[0].large.filename;

    jj.originalName = z[0].original.filename;

    jj.relativePath = z[0].large.path.slice(image_destination_path.length, image_destination_path.length + 8);
    jj.mediumName = z[0].medium.filename;

    jj.thumbnailName = z[0].thumbnail.filename;

    // //createItemImageDto.
    let h = this.itemService.createImage(jj);
    let hh = null;
    await h.then((z) => {
      hh = z;
    });

    console.log(hh.id);

    createItemDto.image = hh.id;
    createItemDto.imageUpload = z[0].originalname;
    return this.itemService.create(createItemDto);
  }

  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(id);
  }

    // Download fle
    @Get('image_stream/:imageName')
    getFile(@Res() res) {
      const stream = createReadStream(join(process.cwd(), image_destination_path, 'sasa.jpeg'));
      const transform = sharp().resize(800).withMetadata().png({quality: 1 }).blur(1)
      res.set("Content-Type", `image/png`)
      stream.pipe(transform).pipe(res)
      
      // const file = createReadStream(
      //   join(process.cwd(), image_destination_path + '/' + imagename),
      // );
      return new StreamableFile(stream);
    }

  @Get('image/:imagename')
  async findImage(
    @Param('imagename') imagename: string,
    @Res() res,
    @Query() query,
  ) {
    // DELETE Multiple Files ->
    // fileS.readdir(join(process.cwd(), image_destination_path), (err, files) => {
    //   files.forEach(file => {
    //     if(file.startsWith(imagename.split('.')[0]))
    //       fileS.unlink(join(process.cwd(), image_destination_path + "/" +file), () => {console.log('aqui')})
    //     console.log(file);
    //   });
    // });
    // Delete only a file
    //fileS.unlink(join(process.cwd(), image_destination_path + "/" +imagename), () => {console.log('aqui')})
    console.log(query['type']);
    let imageObjectPromise = this.itemService.findOneImage(imagename); // Get Image From DB
    let imageObject = null;
    await imageObjectPromise.then((z) => {
      imageObject = z;
    });

    let imageToShow = null;
    let pathBeforeImage = null;

    switch (query['type']) {
      case ('thumbnail' || 'thumb'):
        imageToShow = imageObject.thumbnailName;
        pathBeforeImage = 'thumbnail';
        break;
      case ('large' || 'lg'):
        imageToShow = imageObject.largeName;
        pathBeforeImage = 'large';
        break;
      case ('medium' || 'md'):
        imageToShow = imageObject.mediumName;
        pathBeforeImage = 'medium';
        break;
      default:
        imageToShow = imageObject.originalName;
        pathBeforeImage = 'original';   
        break;
    }

    console.log(imageToShow);

    return res.sendFile(
      join(
        process.cwd(),
        image_destination_path,
        imageObject.relativePath,
        pathBeforeImage,
        imageToShow,
      ),
    );
  }


}
