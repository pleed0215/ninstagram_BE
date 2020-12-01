import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entity/core.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { Message } from './message.entity';

@InputType('LikeInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class ChatRoom extends CoreEntity {
  @ManyToMany(
    type => User,
    (participants: User) => participants.chatRooms,
  )
  @JoinTable()
  @Field(type => [User])
  participants: User[];

  @OneToMany(
    type => Message,
    (messages: Message) => messages.chatRoom,
    { nullable: true },
  )
  @Field(type => [Message], { nullable: true })
  messages?: Message[];
}
