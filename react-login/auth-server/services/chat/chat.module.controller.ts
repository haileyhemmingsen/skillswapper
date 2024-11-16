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

import { ChatService } from './chat.module.service';
import { Message } from './chat.module.index';

@Route('sendMessage')
export class createMessageController extends Controller {
    @Post()
    @Security('jwt')
    @Response('500', 'Internal Error')
    @SuccessResponse('200', 'Message Created')
    public async sendMessage(
        @Body() body: Message,
        @Request() request: express.Request
    ): Promise<boolean | undefined> {
        return new ChatService().sendMessage(body, `${request.user?.id}`).then(async (identifier: boolean | undefined): Promise<boolean|undefined> => {
            if(!identifier) {
                this.setStatus(500);
            }
            return identifier;
        });
    }
}

@Route('unsubscribe')
export class unsubscribeController extends Controller {
    @Post()
    @Security('jwt')
    @Response('500', 'Internal Error')
    @SuccessResponse('200', 'Unsubscribed')
    public async unsubscribe(
        @Body() body: {receiver: string},
        @Request() request: express.Request
    ): Promise<boolean | undefined> {
        return new ChatService().unsubscribe(`${request.user?.id}`, body.receiver).then(async (identifier: boolean | undefined): Promise<boolean|undefined> => {
            if(!identifier) {
                this.setStatus(500);
            }
            return identifier;
        });
    }
}