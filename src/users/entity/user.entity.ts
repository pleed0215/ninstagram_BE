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
  OneToOne,
} from 'typeorm';
import { Verification } from './verification.entity';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

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
  @Column()
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
    { cascade: true },
  )
  verification: Verification;

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
