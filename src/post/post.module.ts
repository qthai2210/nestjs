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


@Module({
  imports: [MongooseModule.forFeature([
    {
      name: 'Post',
      schema: PostSchema
    },
    {
      name: 'Category',
      schema: CategorySchema
    }

  ],),],
  controllers: [PostController, CategoryController],
  providers: [PostService, PostRepository, CategoryRepository,
    CategoryService
  ],
  //exports: [PostRepository],

})
export class PostModule { }
