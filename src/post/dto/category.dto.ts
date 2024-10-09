import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty() title: string;
    description: string;
    content: string;
    user: string;
}

export class UpdateCategoryDto {
    @IsNotEmpty() id: string;
    @IsString() title: string;
    description: string;
    content: string;
}
