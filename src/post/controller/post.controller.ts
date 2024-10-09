import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters, UseGuards } from '@nestjs/common';

import { PostService } from '../services/post.service';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { ExceptionLoggerFilter } from 'src/utils/exceptionLogger.filter';
import { HttpExceptionFilter } from 'src/utils/httpException.filter';
import { AuthGuard } from '@nestjs/passport';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../commands/createPost.command';
import { GetPostQuery } from '../queries/getPost.query';


@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService,

        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Get()
    getAllPost(@Query() { page, limit, start }) {
        return this.postService.getAllPost(page, limit, start);
    }
    @Get(':id')
    //@UseFilters(ExceptionLoggerFilter)
    @UseFilters(HttpExceptionFilter)
    getPostById(@Param('id') id: string) {
        return this.postService.getPostById(id);
    }
    @Get(':id/get-by-query')
    //@UseFilters(ExceptionLoggerFilter)
    @UseFilters(HttpExceptionFilter)
    getDetailByQuery(@Param('id') id: string) {
        return this.queryBus.execute(new GetPostQuery(id));
    }
    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createPost(@Req() req: any, @Body() post: CreatePostDto) {
        return this.postService.createPost(req.user, post);
    }

    @Post('create-by-command')
    @UseGuards(AuthGuard('jwt'))
    async createByCommand(@Req() req: any, @Body() post: CreatePostDto) {
        return this.commandBus.execute(new CreatePostCommand(req.user, post));
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

    @UseGuards(AuthGuard('jwt'))
    @Get('user/all')
    async getPostByUser(@Req() req: any) {
        await req.user.populate('posts');
        return req.user.posts;
    }

    @Get('get/category')
    async getByCategory(@Query('category_id') category_id) {
        return await this.postService.getByCategory(category_id);
    }

    @Get('get/categories')
    async getByCategories(@Query('category_ids') category_ids) {
        return await this.postService.getByCategories(category_ids);
    }
    @Get('get/array')
    async getByArray() {
        return await this.postService.getByArray();
    }
}
