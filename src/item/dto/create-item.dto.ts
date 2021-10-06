import { List } from '../../list/entities/list.entity';

import {ItemImages} from '../entities/itemImages.entity'
export class CreateItemDto {
  readonly itemName: string;

  readonly itemStars?: number;

  readonly description: string;

   imageUpload?: string;

  readonly list: List;

  image : ItemImages;

}
