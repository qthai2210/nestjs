import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { Post } from '../model/post.model';
import { PostRepository } from '../repository/post.repository';
import { PostNotFoundException } from '../exceptions/postNotFound.exception';
import { User } from 'src/user/models/user.model';
import { CategoryRepository } from '../repository/category.repository';
import { skip } from 'node:test';
import { isValidObjectId } from 'mongoose';


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

    async getAllPost(page: number, limit: number, start: string): Promise<{ totalPage: number, posts: Post[] }> {
        const count = await this.postRepository.countDocuments({});
        if (count === 0) {
            throw new NotFoundException('No post found');
        }
        const totalPage = Math.ceil(count / limit);
        const posts = await this.postRepository.getByCondition(
            {
                _id: { $gt: isValidObjectId(start) ? start : '000000000000000000000000', }

            },
            null,
            {
                // -1 for descending order, 1 for ascending order
                sort: { _id: 1 },
                skip: (page - 1) * limit,
                limit: limit,
            },

        );
        return { totalPage, posts };
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

    async getByArray() {
        return await this.postRepository.getByCondition({
            // categories: {
            //     $in: ['60f4e8c9a2d3b1f6d8b2b0a3', '60f4e8c9a2d3b1f6d8b2b0a4'],
            // },
            tags: {
                $all: ['tag1', 'tag2']
            }
        });
    }


}
