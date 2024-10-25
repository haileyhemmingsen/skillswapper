import {
	Body,
	Query,
	Controller,
	Post,
	Get,
	Response,
	Route,
	SuccessResponse,
} from 'tsoa';

import { PostService } from './posts.module.service';
import { NewPost, PostComment, SkillPost } from './posts.module.index';

@Route('createPost')
export class NewPostController extends Controller {
    @Post()
    @Response('500', 'Internal Error') // need to define multiple different possible errors (500 error for internal server, and 401 for bad auth header)
    @Response('401', 'Unauthorized')
    @SuccessResponse('201', 'Post Created')
    public async newPost(@Body() body: NewPost): Promise<number | undefined> {
        return new PostService().newPost(body).then(async (identifier: number | undefined): Promise<number|undefined> => {
            return 1000;
        });
    }
}

@Route('createComment')
export class NewCommentController extends Controller {
    @Post()
    @Response('500', 'Internal Error') // need to define multiple different possible errors (500 error for internal server, and 401 for bad auth header)
    @Response('401', 'Unauthorized')
    @SuccessResponse('201', 'Comment Created')
    public async newComment(@Body() body: PostComment): Promise<number | undefined> {
        return new PostService().newComment(body).then(async (identifier: number | undefined): Promise<number|undefined> => {
            return 1000;
        });
    }
}

@Route('getLocalPosts')
export class GetLocalPostsController extends Controller {
    @Post()
    @Response('500', 'Internal Error')
    @SuccessResponse('200', 'Posts Retrieved')
    public async getLocalPosts(@Body() body: string | undefined | null): Promise <SkillPost[]> {
        return [];
    }
}