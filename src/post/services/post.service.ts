import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { Post } from '../model/post.model';
import { PostRepository } from '../repository/post.repository';
import { PostNotFoundException } from '../exceptions/postNotFound.exception';


@Injectable()
export class PostService {
    // private lastPostId = 0;
    // private posts: Post[] = [];
    constructor(private readonly postRepository: PostRepository) { }

    async getAllPost(): Promise<Post[]> {
        return this.postRepository.getByCondition({});
    }

    async getPostById(id: string): Promise<Post> {
        const post = await this.postRepository.findById(id);
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
            //throw new PostNotFoundException(id);
        }
        return post;
    }

    async createPost(post: CreatePostDto): Promise<Post> {
        return this.postRepository.create(post);
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
