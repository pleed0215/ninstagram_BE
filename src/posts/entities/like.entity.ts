import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entity/core.entity';
import { User } from 'src/users/entity/user.entity';
import { Entity, ManyToOne, RelationId } from 'typeorm';
import { MyPost } from './post.entity';

@InputType('LikeInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Like extends CoreEntity {
  @Field(type => User)
  @ManyToOne(
    type => User,
    (user: User) => user.likes,
    { onDelete: 'CASCADE' },
  )
  user: User;

  @RelationId((like: Like) => like.user)
  userId: number;

  @Field(type => MyPost)
  @ManyToOne(
    type => MyPost,
    (post: MyPost) => post.likes,
    { onDelete: 'CASCADE' },
  )
  post: MyPost;

  @RelationId((like: Like) => like.post)
  postId: number;
}
