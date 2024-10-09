import { User } from "aws-sdk/clients/budgets";
import { CreatePostDto } from "../dto/post.dto";

export class CreatePostCommand {
    constructor(
        public readonly user: User,
        public readonly createPostDto: CreatePostDto,
    ) { }



}