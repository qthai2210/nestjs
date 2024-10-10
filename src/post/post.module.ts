import { Module } from '@nestjs/common';
import { PostController } from './controller/post.controller';
import { PostService } from './services/post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './model/post.model';
import { PostRepository } from './repository/post.repository';
import { CategorySchema } from './model/category.model';
import { CategoryRepository } from './repository/category.repository';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controller/category.controller';
import { MediaController } from 'src/media/controller/media.controller';
import { MediaRepository } from 'src/media/repositories/media.repository';
import { MediaService } from 'src/media/services/media.service';
import { UserModule } from 'src/user/user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostHandler } from './handler/createPost.handler';
import { GetPostHandler } from './handler/getPost.handler';
import { CacheModule, CacheStoreFactory } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';


@Module({
  imports:
    [MongooseModule.forFeature(
      [
        {
          name: 'Post',
          schema: PostSchema
        },
        {
          name: 'Category',
          schema: CategorySchema
        },

      ],
    ),
      UserModule,
      CqrsModule,
    CacheModule.registerAsync(

      {

        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({



          // is global : true for multi server
          isGlobal: true,
          url: configService.get('REDIS_URL'),

          store: redisStore as unknown as CacheStoreFactory,
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          // username: configService.get('REDIS_USERNAME'),
          // password: configService.get('REDIS_PASSWORD'),



        }),


      })
    ],
  controllers: [PostController, CategoryController],
  providers: [PostService, PostRepository, CategoryRepository,
    CategoryService, CreatePostHandler, GetPostHandler
  ],
  //exports: [PostRepository],

})
export class PostModule { }
