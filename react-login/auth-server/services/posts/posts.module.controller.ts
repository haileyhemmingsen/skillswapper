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
  Request,
} from 'tsoa';
import express from 'express';

import { PostService } from './posts.module.service';
import {
  NewPost,
  PostComment,
  SkillPost,
  Categories,
  Comment,
  Archive,
  EditPost,
} from './posts.module.index';

@Route('createPost')
export class NewPostController extends Controller {
  @Post()
  @Security('jwt')
  @Response('500', 'Internal Error')
  @Response('401', 'Unauthorized')
  @SuccessResponse('201', 'Post Created')
  public async newPost(
    @Body() body: NewPost,
    @Request() request: express.Request
  ): Promise<string | undefined> {
    return new PostService()
      .newPost(body, `${request.user?.id}`)
      .then(
        async (identifier: string | undefined): Promise<string | undefined> => {
          // Only returns undefined if there is an error
          // in the try-catch
          if (!identifier) {
            this.setStatus(500);
          }
          return identifier;
        }
      );
  }
}

@Route('createComment')
export class NewCommentController extends Controller {
  @Post()
  @Security('jwt')
  @Response('500', 'Internal Error')
  @Response('401', 'Unauthorized')
  @SuccessResponse('201', 'Comment Created')
  public async newComment(
    @Body() body: PostComment,
    @Request() request: express.Request
  ): Promise<boolean | undefined> {
    return new PostService()
      .newComment(body, `${request.user?.id}`)
      .then(
        async (
          identifier: boolean | undefined
        ): Promise<boolean | undefined> => {
          if (!identifier) {
            this.setStatus(500);
          }
          return identifier;
        }
      );
  }
}

@Route('getLocalPosts')
export class GetLocalPostsController extends Controller {
  @Post()
  @Response('500', 'Internal Error')
  @SuccessResponse('200', 'Posts Retrieved')
  public async getLocalPosts(
    @Body() body: Categories | undefined | null
  ): Promise<SkillPost[]> {
    return new PostService()
      .getLocalPosts(body)
      .then(async (posts: SkillPost[]): Promise<SkillPost[]> => {
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
  public async getUserPosts(
    @Request() request: express.Request
  ): Promise<SkillPost[]> {
    return new PostService()
      .getUserPosts(`${request.user?.id}`)
      .then(async (posts: SkillPost[]): Promise<SkillPost[]> => {
        return posts;
      });
  }
}

@Route('getAllComments')
export class GetAllCommentsController extends Controller {
  @Get()
  @Response('500', 'Internal Error')
  @SuccessResponse('200', 'Comments Retrieved')
  public async getAllComments(
    @Query() post_id: string | undefined
  ): Promise<Comment[]> {
    return new PostService()
      .getAllComments(post_id)
      .then(async (comments: Comment[]): Promise<Comment[]> => {
        return comments;
      });
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
    return new PostService()
      .archiveStatusUpdate(body, `${request.user?.id}`)
      .then(
        async (
          identifier: boolean | undefined
        ): Promise<boolean | undefined> => {
          if (identifier === false) {
            this.setStatus(500);
          }
          return identifier;
        }
      );
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
    @Body() body: EditPost,
    @Request() request: express.Request
  ): Promise<boolean | undefined> {
    return new PostService()
      .editPost(body, `${request.user?.id}`)
      .then(
        async (
          identifier: boolean | undefined
        ): Promise<boolean | undefined> => {
          return identifier;
        }
      );
  }
}
