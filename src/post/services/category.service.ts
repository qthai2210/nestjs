import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PostRepository } from '../repository/post.repository';
import { CategoryRepository } from '../repository/category.repository';
import { CreateCategoryDto } from '../dto/category.dto';


@Injectable()
export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository,
        private readonly postRepository: PostRepository,
    ) { }

    async getAll() {
        return await this.categoryRepository.getByCondition({});
    }

    async create(createCategoryDto: CreateCategoryDto) {
        return await this.categoryRepository.create(createCategoryDto);
    }

    async getPosts(category_id) {
        return await this.postRepository.getByCondition({
            categories: { $elemMatch: { $eq: category_id } },
        });
    }
}
