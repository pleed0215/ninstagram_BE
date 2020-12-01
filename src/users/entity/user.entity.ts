import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEmail, IsString, IsUrl } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Verification } from './verification.entity';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Like } from 'src/posts/entities/like.entity';
import { MyPost } from 'src/posts/entities/post.entity';
import { ChatRoom } from 'src/chats/entities/chatroom.entity';

export enum UserState {
  LOGOUT = 'LOGOUT',
  LOGIN = 'LOGIN',
  SECRET = 'SECRET',
}

registerEnumType(UserState, { name: 'UserState' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field(type => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  avatar?: string;

  @Field(type => String)
  @Column()
  @IsString()
  username: string;

  @Field(type => String)
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Field(type => String, { nullable: true })
  @Column({ nullable: true })
  bio?: string;

  @Column({ select: false })
  password: string;

  @Field(type => Boolean)
  @Column({ default: false })
  verified: boolean;

  @Field(type => [User], { nullable: true })
  @ManyToMany(
    type => User,
    user => user.following,
  )
  @JoinTable()
  followers?: User[];

  @Field(type => UserState, { nullable: true })
  @Column({
    enum: UserState,
    type: 'enum',
    default: UserState.LOGOUT,
    nullable: true,
  })
  state: UserState;

  @Field(type => [User], { nullable: true })
  @ManyToMany(
    type => User,
    user => user.followers,
  )
  following?: User[];

  @OneToOne(
    type => Verification,
    verififcation => verififcation.user,
    { cascade: true, nullable: true },
  )
  verification: Verification;

  // relations
  @OneToMany(
    type => Like,
    (like: Like) => like.user,
    { nullable: true },
  )
  @Field(type => [Like], { nullable: true })
  likes?: Like[];

  @OneToMany(
    type => MyPost,
    (post: MyPost) => post.writer,
    { nullable: true },
  )
  @Field(type => [MyPost], { nullable: true })
  posts?: MyPost[];

  @ManyToMany(
    type => ChatRoom,
    chatrooms => chatrooms.participants,
    { nullable: true },
  )
  @Field(type => [ChatRoom], { nullable: true })
  chatRooms: ChatRoom[];

  // methods
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
