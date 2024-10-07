import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { Post } from '../model/post.model';
import { PostRepository } from '../repository/post.repository';
import { PostNotFoundException } from '../exceptions/postNotFound.exception';
import { User } from 'src/user/models/user.model';
import { CategoryRepository } from '../repository/category.repository';


@Injectable()
export class PostService {
    async getByCategory(category_id: string) {
        return await this.postRepository.getByCondition({
            categories: {
                $elemMatch: { $eq: category_id },
            },
        });
    }

    async getByCategories(category_ids: [string]) {
        console.log(category_ids);
        return await this.postRepository.getByCondition({
            categories: {
                $all: category_ids,
            },
        });
    }
    // private lastPostId = 0;
    // private posts: Post[] = [];
    constructor(private readonly postRepository: PostRepository, private readonly categoryRepository: CategoryRepository) { }

    async getAllPost(): Promise<Post[]> {
        return this.postRepository.getByCondition({});
    }

    async getPostById(id: string): Promise<Post> {
        const post = await this.postRepository.findById(id);
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
            //throw new PostNotFoundException(id);
        } else {

            //await post.populate('user');
            await post.populate({ path: 'user', select: '-password' });
            return post;
        }

    }

    async createPost(user: User, post: CreatePostDto): Promise<Post> {
        post.user = user._id;
        const new_post = await this.postRepository.create(post);
        if (post.categories) {
            await this.categoryRepository.updateMany({ _id: { $in: post.categories } }, { $push: { posts: new_post._id } });
        }
        return new_post;
    }

    async replacePost(id: string, post: UpdatePostDto): Promise<Post> {
        const postExist = await this.postRepository.findById(id);
        if (!postExist) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
        return this.postRepository.findByConditionAndUpdate({ _id: id }, post);
    }

    async deletePost(id: string): Promise<boolean> {
        const postExist = await this.postRepository.findById(id);
        if (!postExist) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
        await this.postRepository.deleteOne(id);
        return true;
    }



}
