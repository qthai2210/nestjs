import { Module } from '@nestjs/common';
import { PostController } from './controller/post.controller';
import { PostService } from './services/post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './model/post.model';
import { PostRepository } from './repository/post.repository';


@Module({
  imports: [MongooseModule.forFeature([
    {
      name: 'Post',
      schema: PostSchema
    }

  ],),],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  //exports: [PostRepository],

})
export class PostModule { }
