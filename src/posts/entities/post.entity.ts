import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { string } from 'joi';
import { CoreEntity } from 'src/common/entity/core.entity';
import { User } from 'src/users/entity/user.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Like } from './like.entity';

@InputType('PostInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class MyPost extends CoreEntity {
  @Field(type => String, { nullable: true })
  @Column({ nullable: true })
  location: string;

  @Field(type => String)
  @Column()
  caption: string;

  @ManyToOne(
    type => User,
    (writer: User) => writer.posts,
    { onDelete: 'CASCADE' },
  )
  @Field(type => User)
  writer: User;

  @RelationId((post: MyPost) => post.writer)
  writerId: number;

  @OneToMany(
    type => Like,
    (like: Like) => like.user,
  )
  @Field(type => [Like])
  likes?: Like[];
}
