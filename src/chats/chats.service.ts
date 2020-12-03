import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/common/common.contant';
import { User } from 'src/users/entity/user.entity';
import { In, Repository } from 'typeorm';
import { TRIGGER_MESSAGE } from './chats.constant';
import {
  SeeChatRoomInput,
  SeeChatRoomOutput,
  SendMessageInput,
  SendMessageOutput,
} from './dtos/chats.dto';
import { ChatRoom } from './entities/chatroom.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(ChatRoom)
    private readonly chatRooms: Repository<ChatRoom>,
    @InjectRepository(Message) private readonly messages: Repository<Message>,
    @Inject(PUB_SUB) private readonly pubsub: PubSub,
  ) {}

  async sendMessage(
    authUser: User,
    { toId, text }: SendMessageInput,
  ): Promise<SendMessageOutput> {
    try {
      if (toId === authUser.id)
        throw Error('You cannot send message yourself.');
      const toUser = await this.users.findOneOrFail(toId, {
        relations: ['chatRooms'],
      });

      let chatRoom = await this.chatRooms
        .createQueryBuilder('chatRoom')
        .leftJoinAndSelect('chatRoom.participants', 'participants')
        .where('participants.id IN (:...ids)', { ids: [authUser.id, toId] })
        .getOne();

      if (!chatRoom) {
        chatRoom = this.chatRooms.create();
        chatRoom.participants = [authUser, toUser];

        chatRoom = await this.chatRooms.save(chatRoom);
      }

      const message = await this.messages.save(
        this.messages.create({
          to: toUser,
          from: authUser,
          chatRoom,
          text,
        }),
      );

      this.pubsub.publish(TRIGGER_MESSAGE, {
        message,
      });

      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: e.toString(),
      };
    }
  }

  async seeChatRoom(
    authUser: User,
    { chatRoomId }: SeeChatRoomInput,
  ): Promise<SeeChatRoomOutput> {
    try {
      const chatRoom = await this.chatRooms.findOneOrFail(chatRoomId, {
        relations: ['participants', 'messages', 'messages.from', 'messages.to'],
      });

      if (chatRoom.participants.some(p => p.id === authUser.id)) {
        return {
          ok: true,
          messages: [...chatRoom.messages],
          participants: [...chatRoom.participants],
        };
      } else {
        throw Error(
          `User: ${authUser.email} is not participants of this chat room.`,
        );
      }
    } catch (e) {
      return {
        ok: true,
        error: e.toString(),
      };
    }
  }
}
