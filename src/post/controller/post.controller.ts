import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';

import { PostService } from '../services/post.service';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { ExceptionLoggerFilter } from 'src/utils/exceptionLogger.filter';
import { HttpExceptionFilter } from 'src/utils/httpException.filter';
import { AuthGuard } from '@nestjs/passport';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../commands/createPost.command';
import { GetPostQuery } from '../queries/getPost.query';

import { CACHE_MANAGER, CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService,

        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }
    @Get(':id/get-with-cache')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(300) // Cache responses for 5 minutes (300 seconds)
    async getPostDetailWithCache(@Param('id') id: string) {
        console.log('Run here');
        return (await this.postService.getPostById(id)).toJSON();
    }

    @Get('cache/demo/set-cache')
    @CacheTTL(300)
    async demoSetCache() {
        await this.cacheManager.set('newnet', 'hello world');// Cache the post
        await this.cacheManager.set('newnet1', 'hello world1');// Cache the post
        await this.cacheManager.set('newnet2', 'hello world1');// Cache the post

        return true;
    }
    @Get('cache/demo/get-cache')
    async demoGetCache() {
        return await this.cacheManager.get('newnet'); // Get the post
    }
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
