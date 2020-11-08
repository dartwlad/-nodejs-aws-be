import {IsNumber, IsString} from 'class-validator';

export class CreateProductDto {
    @IsString()
    public image: string;

    @IsString()
    public title: string;

    @IsString()
    public description: string;

    @IsNumber()
    public price: number;

    @IsNumber()
    public count: number;
}
