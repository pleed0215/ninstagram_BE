import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entity/core.entity';
import { MyPost } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entity/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { ChatRoom } from './chatroom.entity';

@InputType('MessageInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Message extends CoreEntity {
  @Field(type => User)
  @ManyToOne(type => User, { onDelete: 'CASCADE' })
  from: User;

  @Field(type => User)
  @ManyToOne(type => User, { onDelete: 'CASCADE' })
  to: User;

  @Field(type => String)
  @Column()
  text: string;

  @Field(type => ChatRoom)
  @ManyToOne(
    type => ChatRoom,
    (chatRoom: ChatRoom) => chatRoom.messages,
    { onDelete: 'CASCADE' },
  )
  chatRoom: ChatRoom;

  @RelationId((message: Message) => message.chatRoom)
  chatRoomId: number;
}
