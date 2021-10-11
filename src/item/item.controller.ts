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
  NotFoundException,
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
import {finished, pipeline} from 'stream'
import { throws, rejects } from 'assert';

export const image_destination_path = './uploads/item-images';

export interface sharpColorOptions {
  /** WRITE!!!!!
   *  
   * Values: red, green and blue. The values must be over 0 and under 255
   */
  tint? : {
    r: number, 
    g: number,
    b: number,
  },

  greyscale?: true,
  grayscale?: true,
  pipelineColourspace? : 'multiband' | "b-w" | "histogram" | "xyz" | "lab" | "cmyk" | "labq" | "rgb" | "cmc" | "lch" | "labs" | "srgb" | "yxy" | "fourier" | "rgb16" | "grey16" | "matrix" | "scrgb" | "hsv" | "last",
  toColourspace? : 'multiband' | "b-w" | "histogram" | "xyz" | "lab" | "cmyk" | "labq" | "rgb" | "cmc" | "lch" | "labs" | "srgb" | "yxy" | "fourier" | "rgb16" | "grey16" | "matrix" | "scrgb" | "hsv" | "last",

}

export interface sharpChannelOptions {
  removeAlpha?: true,
  ensureAlpha?: 0 | 1,
  extractChannel?: 'green' | 'red' | 'blue' | 'alpha',
  bandbool? : 'and' | 'or' | 'eor'
}

export interface sharpImageOptions {
  heigth?: number,
  width?: number,
  outPutFormat? : "jpeg" | "png" | "webp" | "gif" | "jp2" | "tiff" | "avif" | "heif" | "reaw" | "tile"
  quality?: number,
  squareSize?: number,
  //cover, contain, fill, inside or outside
  fit? : 'cover' | 'contain' | 'fill' | 'insede' | 'outside',
}

export interface sharpImageOperations {
  /** Activates or deactivates the sharpImageOperations function 
   *  
   * Values: true or false
   */
  applyImageOperations: boolean,

  /** Rotate the image 
   *  
   * If an angle is provided, it is converted to a valid positive degree rotation. For example, -450 will produce a 270deg rotation.
   * 
   * Value: Number
   */
  rotate? : number,

  /** Flip the image about the vertical Y axis. 
   *  
   * Value: true or false
   */
  flip? : true, // Flip by Y

  /** Flip the image about the horizontal X axis. 
   *  
   * Value: true or false
   */
  flop? : true, // Flip by X

  /** Blur the image.
   * 
   *  When used without parameters, performs a fast, mild blur of the output image.
   * 
   *  Value between 0.3 and 1000
   */
  blur? : number, // > 0.3 - 100000


  sharpen? : {
    sigma,
    flat?,
    jagged?,
  },
  median?: number,
  gamma?: {
    gamma: number,// 1.0 - 3.0
    gammaOut?: number, // 1.0 - 3.0
  }, 
  
  negate?: true,
  normalise? : true,
  normalize? : true,
  convolve? : {
    width : number,
    height : number,
    kernel : number[], // width x height length
    scale? : number,
    offset? : number,
  },
  threshold? : {
    threshold: number,
    options? :{
      greyscale: boolean, 
      grayscale: boolean
    }
  },
  linear?: {
    multiplier?: number,
    offset?: number,
  },
  recomb?: [[number, number, number],[number, number, number],[number, number, number]],
  modulate?:{
    brightness?: number, // increase brightness by a factor of 2
    saturation?: number,
    hue?: number,
    lightness?: number,
  }
}

export const defaultSharpOptions : sharpImageOptions = {
  heigth: 500,
  width: 500,
  outPutFormat: "webp",
  quality: 80,
  squareSize: null,
  fit: 'cover'
}




export const defaultSharpImageOperations : sharpImageOperations = {
applyImageOperations: true,
}

export function readFilePassedBy(imagePath){
  return fileS.createReadStream(imagePath)     
}

export function setSharpColorOptions(sharp, colorOptions:sharpColorOptions){
  if(colorOptions.tint != undefined){
    if((colorOptions.tint.r && colorOptions.tint.g && colorOptions.tint.b) >= 0 || (colorOptions.tint.r && colorOptions.tint.g && colorOptions.tint.b) <= 255){
      sharp.tint({
        r: colorOptions.tint.r,
        g:colorOptions.tint.g,
        b: colorOptions.tint.b,
      })
    }
    else{
      console.error('The RGB values must be between 0 and 255')
    }
  }

  if(colorOptions.grayscale != undefined){
    sharp.grayscale(colorOptions.grayscale)
  }

  if(colorOptions.greyscale != undefined){
    sharp.greyscale(colorOptions.greyscale)
  }

  if(colorOptions.pipelineColourspace != undefined){
    sharp.pipelineColourspace(colorOptions.pipelineColourspace)
  }

  if(colorOptions.toColourspace != undefined){
    sharp.toColourspace(colorOptions.toColourspace)
  }

  return sharp
}

export function setSharpChannelOptions(sharp, channelsOptions: sharpChannelOptions){
  if(channelsOptions.removeAlpha != undefined){
    sharp.removeAlpha(true)
  }
  if(channelsOptions.ensureAlpha != undefined){
    sharp.ensureAlpha(channelsOptions.ensureAlpha)
  }
  if(channelsOptions.extractChannel != undefined){
    sharp.extractChannel(channelsOptions.extractChannel)
  }
  if(channelsOptions.bandbool!=undefined){
    switch (channelsOptions.bandbool) {
      case 'and':
        sharp.bandbool(sharp.bool.and)
        break;
        case 'or':
          sharp.bandbool(sharp.bool.or)
          break;
          case 'eor':
            sharp.bandbool(sharp.bool.eor)
            break;
      default:
        break;
    }
  }
  return sharp
}

export function setSharpImageOperation(sharp, options: sharpImageOperations){

  if(options.blur != undefined){
    if(options.blur >= 0.3 && options.blur < 1000)
    sharp.blur(options.blur);
  else
    console.error("The blur value is out of bound")
  }

  if(options.convolve != undefined){
    if(options.convolve.kernel.length == (options.convolve.width * options.convolve.height))
    {
      sharp.convolve({
        width: options.convolve.width,
        height: options.convolve.height,
        kernel: options.convolve.kernel,
        scale: options.convolve.scale,
        offset: options.convolve.offset,
      })
    }
    else{
      console.error(`Kernel length higher or lower than ${options.convolve.width * options.convolve.height}`)
    }
  }

  if(options.flip != undefined){
    sharp.flip(options.flip)
  }

  if(options.flop != undefined){
    sharp.flop(options.flop)
  }

  if(options.gamma != undefined){
    if(options.gamma.gamma >= 1.0 && options.gamma.gamma <= 3.0){
      sharp.gamma(options.gamma.gamma, (options.gamma.gammaOut >= 1.0 && options.gamma.gammaOut <=3.0)? options.gamma.gammaOut : undefined)
    }
    else{
      console.error("The gamma value must be between 1.0 and 3.0. In case that you are using gammaOut, the value must be in the same range")
    }
  } 

  if(options.linear != undefined){
    sharp.linear(options.linear.multiplier, options.linear.offset)
  }

  if(options.median != undefined){
    sharp.median(options.median)
  }

  if(options.modulate != undefined){
    sharp.modulate({
      brightness: options.modulate.brightness,
      hue: options.modulate.hue,
      saturation: options.modulate.saturation,
      lightness: options.modulate.lightness,
    })
  }

  if(options.negate != undefined){
    sharp.negate(true)
  }

  if(options.normalise != undefined){
    sharp.normalise(true)
  }

  if(options.normalize != undefined){
    sharp.normalize(true)
  }

  if(options.recomb != undefined){
    sharp.recomb(options.recomb)
  }    

  if(options.rotate != undefined){
    sharp.rotate(options.rotate)
  }

  if(options.sharpen != undefined)
  {
    sharp.sharpen(options.sharpen.sigma, options.sharpen.flat, options.sharpen.jagged)
  }

  if(options.threshold != undefined){
    if(options.threshold.threshold >= 0 && options.threshold.threshold < 255)
    sharp.threshold(options.threshold.threshold, {
      greyscale: options.threshold.options!= undefined ? options.threshold.options.greyscale : false,
      grayscale: options.threshold.options!= undefined ? options.threshold.options.grayscale : false,
    })
    else
    console.error('The treshold must be between 0 and 255')
  }

  return sharp;
}

export function createSharpFilter(options?: sharpImageOptions, optionsImageOperations? : sharpImageOperations){
  try{
  if(!options){
    options= defaultSharpOptions;
  }
  if(!optionsImageOperations)
  {
    optionsImageOperations = defaultSharpImageOperations
  }
  let sharkSharp = sharp().resize(options.width, options.heigth, {fit: options.fit}).toFormat(
    options.outPutFormat,
    {
      quality: options.quality
    }
  )

  if(optionsImageOperations.applyImageOperations){
    console.log("filter")
    sharkSharp = setSharpImageOperation(sharkSharp, optionsImageOperations);
  }


  sharkSharp.bandbool(sharp.bool.eor)

  return sharkSharp
}
catch(e){
  console.log(e)
  return  null
}
}

export async function sharpImageProcess(imagePath, name, res, options?: sharpImageOptions, optionsImageOperations?: sharpImageOperations,   ) { 

   try{
     let fileType = options? options.outPutFormat : defaultSharpOptions.outPutFormat
     let fileImage = readFilePassedBy(imagePath)
 
     fileImage.on('error', (e) => {
       if(e){
        console.log('File not found')
        res.writeHeader(404,"File not found")
        res.end('File not found')
       }
       else{
        
       }
        
     })   
     
     fileImage.on('open', _ => {
      res.set({"Content-Type": `image/${fileType}`, "Content-Disposition": `filename=${name}`})
     })
       
        let sharpFilter = createSharpFilter(options? options : undefined, optionsImageOperations? optionsImageOperations : undefined

     )

    

    
     
      
     
     return new StreamableFile(fileImage.pipe(sharpFilter).pipe(res))
     
     
      
    
     
     
    }
    catch(e){
   
    }

   

    
     
  

    
  
  


}

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

    jj.relativePath = z[0].large.path.slice(image_destination_path.length - 1, image_destination_path.length - 1 + 8);
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
    @Get('image_file/:imageName')
    async getFileImage( @Param('imageName') imageName, @Res() res, @Query() query,) {
      let imageFromDB = this.itemService.findOneImage(imageName)
      let imageData = null;
      await imageFromDB.then(data => {
        imageData = data;
      })

     
      
      return sharpImageProcess(join(process.cwd(), image_destination_path, imageData.relativePath, 'original' ,imageData.originalName), imageData.originalName, res, null , null)
      
    }
    @Get('image_stream/:imageName')
    async getFile( @Param('imageName') imageName, @Res() res, @Query() query,) {
      let fileType = query['fileType'] || 'jpeg';
      let quality = query['quality'] || 80;
      let squareSize = parseInt(query['squareSize']) || 800;
      let blur =  parseInt(query['blur']);

      //cover, contain, fill, inside or outside
      let fit = query['fit'] || 'cover';

      let width = 0;
      let height = 0;
      // If exist



      

      let imageFromDB = this.itemService.findOneImage(imageName)
      let imageData = null;
      await imageFromDB.then(data => {
        imageData = data;
      })
      const stream = createReadStream(join(process.cwd(), image_destination_path, imageData.relativePath, 'original' ,imageData.originalName));
      
      const transform = sharp();
      let originaInfo = null

      if(query['width'] && query['height'])
        {
          width =parseInt(query['width']);
          height =parseInt(query['height']);
        }
        else if(!query['squareSize'])
        {width =null
          height = null}
          
        else 
          width = height = squareSize

     
      
      transform.resize(width,height, {fit: fit}).toFormat(fileType, {
        quality: parseInt(quality),
      })

      if(blur >= 0.3){
        transform.blur(blur)
      }

      // Put the correct name on the image
      res.set({"Content-Type": `image/${fileType}`, "Content-Disposition": `filename=${imageData.originalName}`})
      // Content Dipostion -> Donwload res.set({"Content-Type": `image/${fileType}`, "Content-Disposition": "attachment; filename=filename.jpg"})
      
      stream.pipe(transform).pipe(res)


    
     
      // const file = createReadStream(
      //   join(process.cwd(), image_destination_path + '/' + imagename),
      // );
      return new StreamableFile(stream)
      
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
      case 'thumb':
      case 'thumbnail':
        imageToShow = imageObject.thumbnailName;
        pathBeforeImage = 'thumbnail';
        break;
      case 'lg':
      case 'large':
        imageToShow = imageObject.largeName;
        pathBeforeImage = 'large';
        break;
      case 'md':
      case 'medium':
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
