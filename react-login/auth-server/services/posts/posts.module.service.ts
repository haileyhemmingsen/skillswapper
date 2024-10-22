import { NewPost, PostComment, SkillPost} from "./posts.module.index";

export class PostService {
    public async newPost(body: NewPost): Promise<number | undefined> {
        // needs to create post ID and send all info to DB
        // needs to grab the date
        // grab their username/UUID
        return 0;
    }

    public async newComment(body: PostComment): Promise <number | undefined> {
        return 0;
    }
    // public async getLocalPosts(): Promise <SkillPost[]> {
    //     // get a list of all posts from database and 
    //     return [];
    // }
}