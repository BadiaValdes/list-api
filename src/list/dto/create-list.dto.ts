import {Item} from '../../item/entities/item.entity'

export class CreateListDto {
    readonly name: string;
    readonly description: string;
    readonly isActive?: boolean;
    readonly slug?: string;
    readonly items?: Item[];
}
 // Like Angular Interface
