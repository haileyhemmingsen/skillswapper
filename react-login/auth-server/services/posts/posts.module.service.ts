import { NewPost, PostComment } from "./posts.module.index";

export class PostService {
    public async newPost(body: NewPost): Promise<number | undefined> {
        return 0;
    }

    public async newComment(body: PostComment): Promise <number | undefined> {
        return 0;
    }
}