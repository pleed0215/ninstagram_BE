import { ArgsType, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { User } from 'src/users/entity/user.entity';
import { Message } from '../entities/message.entity';

@InputType()
export class SendMessageInput {
  @Field(type => Int)
  toId: number;

  @Field(type => String)
  text: string;
}

@ObjectType()
export class SendMessageOutput extends CommonOutput {}

@ArgsType()
export class SeeChatRoomInput {
  @Field(type => Int)
  chatRoomId: number;
}

@ObjectType()
export class SeeChatRoomOutput extends CommonOutput {
  @Field(type => [Message], { nullable: true })
  messages?: Message[];

  @Field(type => [User], { nullable: true })
  participants?: User[];
}
