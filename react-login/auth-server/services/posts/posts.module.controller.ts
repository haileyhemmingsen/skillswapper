import {
	Body,
	Query,
	Controller,
	Post,
	Get,
	Response,
	Route,
	SuccessResponse,
    Security,
    Request
} from 'tsoa';
import express from 'express'

import { PostService } from './posts.module.service';
import { NewPost, PostComment, SkillPost, Categories, Comment, Archive } from './posts.module.index';

@Route('createPost')
export class NewPostController extends Controller {
    @Post()
    @Security('jwt')
    @Response('500', 'Internal Error') // need to define multiple different possible errors (500 error for internal server, and 401 for bad auth header)
    @Response('401', 'Unauthorized')
    @SuccessResponse('201', 'Post Created')
    public async newPost(
        @Body() body: NewPost,
        @Request() request: express.Request
    ): Promise<boolean | undefined> {
        return new PostService().newPost(body, `${request.user?.id}`).then(async (identifier: boolean | undefined): Promise<boolean|undefined> => {
            if(!identifier) {
                this.setStatus(500);
            }
            return identifier;
        });
    }
}

@Route('createComment')
export class NewCommentController extends Controller {
    @Post()
    @Security('jwt')
    @Response('500', 'Internal Error') // need to define multiple different possible errors (500 error for internal server, and 401 for bad auth header)
    @Response('401', 'Unauthorized')
    @SuccessResponse('201', 'Comment Created')
    public async newComment(
        @Body() body: PostComment,
        @Request() request: express.Request
    ): Promise<boolean | undefined> {
        return new PostService().newComment(body, `${request.user?.id}`).then(async (identifier: boolean | undefined): Promise<boolean|undefined> => {
            if(!identifier) {
                this.setStatus(500);
            }
            return identifier;
        });
    }
}
/**
 * due to the fact the below route is a get-route, it would be preferable to make it a GET endpoint
 * it should be feasible to do this by adding params to the url endpoint, in axios call it would appear as
 * axios.get('/my_endpoint', {
 *   params: {
 *     param1: value
 *     param2: value2
 *   }
 * });
 */
@Route('getLocalPosts')
export class GetLocalPostsController extends Controller {
    @Post()
    @Response('500', 'Internal Error')
    @SuccessResponse('200', 'Posts Retrieved')
    public async getLocalPosts(@Body() body: Categories | undefined | null): Promise <SkillPost[]> {
        return new PostService().getLocalPosts(body).then(async (posts: SkillPost[]): Promise <SkillPost[]> => {
            return posts;
        });
    }
}
@Route('getUserPosts')
export class GetUserPostsController extends Controller {
    @Get()
    @Security('jwt')
    @Response('500', 'Internal Error')
    @SuccessResponse('200', 'Posts Retrieved')
    public async getUserPosts(@Request() request: express.Request): Promise <SkillPost[]>  {
        return new PostService().getUserPosts(`${request.user?.id}`).then(async (posts: SkillPost[]): Promise <SkillPost[]> => {
            return posts;
        })
    }
}

@Route('getAllComments')
export class GetAllCommentsController extends Controller {
    @Get()
    @Response('500', 'Internal Error')
    @SuccessResponse('200', 'Comments Retrieved')
    public async getAllComments(
        @Query() post_id: string | undefined
    ): Promise <Comment[]> {
        return new PostService().getAllComments(post_id).then(async (comments: Comment[]): Promise <Comment[]> => {
            return comments;
        })
    }
}

@Route('ArchiveUpdate')
export class ArchiveUpdaterController extends Controller {
    @Post()
    @Security('jwt')
    @Response('500', 'Internal Error')
    @Response('401', 'Unauthorized')
    @SuccessResponse('200', 'Post Updated')
    public async archiveStatusUpdate(
        @Body() body: Archive,
        @Request() request: express.Request 
    ): Promise<boolean | undefined> {
        return new PostService().archiveStatusUpdate(body, `${request.user?.id}`).then(async (identifier: boolean | undefined): Promise<boolean | undefined> => {
            if (identifier === undefined) {
                this.setStatus(401);
            }
            if (identifier === false) {
                this.setStatus(500);
            }
            return identifier;
        });
    }
}

@Route('EditPost')
export class EditPostController extends Controller {
    @Post()
    @Security('jwt')
    @Response('500', 'Internal Error')
    @Response('401', 'Unauthorized')
    @SuccessResponse('200', 'Post Updated')
    public async EditPost(
        @Body() body: SkillPost,
        @Request() request: express.Request
    ): Promise <boolean | undefined> {
        return new PostService().editPost(body, `${request.user?.id}`).then(async (identifier: boolean | undefined): Promise <boolean | undefined> => {
            return identifier;
        });
    }
}