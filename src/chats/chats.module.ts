import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { ChatRoomsResolver, MessagesResolver } from './chats.resolver';
import { ChatsService } from './chats.service';
import { ChatRoom } from './entities/chatroom.entity';
import { Message } from './entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ChatRoom, Message])],
  providers: [ChatsService, MessagesResolver, ChatRoomsResolver],
})
export class ChatsModule {}
