import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
    @IsNotEmpty()
    title: string;
    description: string;
    content: string;
    user: any;
    categories: [string];

}

export class UpdatePostDto {
    @IsNotEmpty()
    id: string;
    content: string;
    @IsNotEmpty()
    title: string;
}

export class PaginationPostDto {
    @IsNotEmpty()
    page: number;

    @IsNotEmpty()
    limit: number;

    @IsNotEmpty()
    start: string;
}
