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
import { Message, Chat_Front, Chat } from './chat.module.index';

@Route('sendMessage')
export class createMessageController extends Controller {
    @Post()
    @Security('jwt')
    @Response('500', 'Internal Error')
    @SuccessResponse('200', 'Message Created')
    public async sendMessage(
        // @Query() chat_id: string,
        @Body() body: Message,
        @Request() request: express.Request
    ): Promise<boolean | undefined> {
        // console.log('got to the send message method');
        return new ChatService().sendMessage(body, `${request.user?.id}`).then(async (identifier: boolean | undefined): Promise<boolean|undefined> => {
            if(!identifier) {
                this.setStatus(500);
            }
            return identifier;
        });
    }
}

// @Route('unsubscribe')
// export class unsubscribeController extends Controller {
//     @Post()
//     @Security('jwt')
//     @Response('500', 'Internal Error')
//     @SuccessResponse('200', 'Unsubscribed')
//     public async unsubscribe(
//         @Body() body: {receiver: string},
//         @Request() request: express.Request
//     ): Promise<boolean | undefined> {
//         return new ChatService().unsubscribe(`${request.user?.id}`, body.receiver).then(async (identifier: boolean | undefined): Promise<boolean|undefined> => {
//             if(!identifier) {
//                 this.setStatus(500);
//             }
//             return identifier;
//         });
//     }
// }

@Route('retrieveChatHistory')
export class retrieveChatHistoryController extends Controller {
    @Get()
    @Security('jwt')
    @Response('500', 'Internal Error')
    @SuccessResponse('200', 'Messages Retrieved')
    public async retrieveChatHistory (
        @Request() request: express.Request,
        @Query() chat_id: string
    ): Promise <Chat | undefined> {
        return new ChatService().retrieveChatHistory(`${request.user?.id}`, chat_id).then(async (chat: Chat | undefined): Promise <Chat | undefined> => {
            if(chat === undefined) {
                this.setStatus(500);
                return chat
            }
            return chat;
        });
    }
}

@Route('retrieveChats')
export class retrieveChatsController extends Controller {
    @Get()
    @Security('jwt')
    @Response('500', 'Internal Error')
    @SuccessResponse('200', 'Message Fronts Retrieved')
    public async retrieveChats (
        @Request() request: express.Request,
    ): Promise <Chat_Front[] | undefined> {
        return new ChatService().retrieveChats(`${request.user?.id}`).then(async (chats: Chat_Front[] | undefined): Promise <Chat_Front[] | undefined> => {
            if (chats === undefined) {
                this.setStatus(500);
            }
            return chats;
        });
    }
}