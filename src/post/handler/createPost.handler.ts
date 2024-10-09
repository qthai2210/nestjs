import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePostCommand } from "../commands/createPost.command";
import { PostRepository } from "../repository/post.repository";


@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
    constructor(private readonly postRepository: PostRepository) { }

    async execute(command: CreatePostCommand) {
        command.createPostDto.user = command.user;
        return await this.postRepository.create(command.createPostDto);
    }
}