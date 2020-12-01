import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, IsUrl } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

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

  @Field(type => [User], { nullable: true })
  @ManyToMany(
    type => User,
    user => user.following,
  )
  @JoinTable()
  followers?: User[];

  @Field(type => [User], { nullable: true })
  @ManyToMany(
    type => User,
    user => user.followers,
  )
  following?: User[];
}
