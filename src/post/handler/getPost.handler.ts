import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetPostQuery } from "../queries/getPost.query";
import { PostRepository } from "../repository/post.repository";

@QueryHandler(GetPostQuery)
export class GetPostHandler implements IQueryHandler<GetPostQuery> {
    constructor(private readonly postRepository: PostRepository) { }

    async execute(query: GetPostQuery) {
        return await this.postRepository.findById(query.post_id);
    }
}