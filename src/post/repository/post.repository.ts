import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/base.repository";

import { Model } from "mongoose";
import { Post } from "../model/post.model";
import { InjectModel } from "@nestjs/mongoose";




@Injectable()
export class PostRepository extends BaseRepository<Post> {
    constructor(@InjectModel('Post') private postModel: Model<Post>) {
        super(postModel);
    }

}
