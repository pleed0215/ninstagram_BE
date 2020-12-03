import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { AuthUser } from 'src/auth/auth.decorator';
import { State } from 'src/auth/state.decorator';
import { PUB_SUB } from 'src/common/common.contant';
import { TRIGGER_MESSAGE } from './chats.constant';
import { ChatsService } from './chats.service';
import {
  SeeChatRoomInput,
  SeeChatRoomOutput,
  SendMessageInput,
  SendMessageOutput,
} from './dtos/chats.dto';
import { ChatRoom } from './entities/chatroom.entity';
import { Message } from './entities/message.entity';

@Resolver(of => Message)
export class MessagesResolver {
  constructor(private readonly service: ChatsService) {}

  @Mutation(type => SendMessageOutput)
  @State(['LOGIN_ANY'])
  sendMessage(
    @AuthUser() authUser,
    @Args('input') input: SendMessageInput,
  ): Promise<SendMessageOutput> {
    return this.service.sendMessage(authUser, input);
  }
}

@Resolver(of => ChatRoom)
export class ChatRoomsResolver {
  constructor(
    private readonly service: ChatsService,
    @Inject(PUB_SUB) private readonly pubsub: PubSub,
  ) {}

  @Query(type => SeeChatRoomOutput)
  @State(['LOGIN_ANY'])
  seeChatRoom(
    @AuthUser() authUser,
    @Args() input: SeeChatRoomInput,
  ): Promise<SeeChatRoomOutput> {
    return this.service.seeChatRoom(authUser, input);
  }

  @Subscription(returns => Message, {})
  @State(['LOGIN_ANY'])
  watingMessage() {
    return this.pubsub.asyncIterator(TRIGGER_MESSAGE);
  }
}
