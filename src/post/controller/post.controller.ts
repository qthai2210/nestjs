import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';

import { PostService } from '../services/post.service';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Get()
    getAllPost() {
        return this.postService.getAllPost();
    }
    @Get(':id')
    getPostById(@Param('id') id: string) {
        return this.postService.getPostById(id);
    }
    @Post()
    async createPost(@Body() post: CreatePostDto) {
        return this.postService.createPost(post);
    }
    @Put(':id')
    async replacePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
        return this.postService.replacePost(id, post);
    }

    @Delete(':id')
    async deletePost(@Param('id') id: string) {
        await this.postService.deletePost(id);
        return true;
    }
}
