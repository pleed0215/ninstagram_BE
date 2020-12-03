import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entity/core.entity';
import { User } from 'src/users/entity/user.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { MyPost } from './post.entity';

@InputType('CommentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Comment extends CoreEntity {
  @Field(type => User)
  @ManyToOne(
    type => User,
    (user: User) => user.comments,
    { onDelete: 'CASCADE' },
  )
  user: User;

  @RelationId((comment: Comment) => comment.user)
  userId: number;

  @Field(type => MyPost)
  @ManyToOne(
    type => MyPost,
    (post: MyPost) => post.likes,
    { onDelete: 'CASCADE' },
  )
  post: MyPost;

  @RelationId((comment: Comment) => comment.post)
  postId: number;

  @Field(type => String, { nullable: true })
  @Column({ nullable: true })
  text: string;

  @Field(type => Comment, { nullable: true })
  @ManyToOne(
    type => Comment,
    parent => parent.replies,
    { onDelete: 'CASCADE' },
  )
  parent: Comment;

  @Field(type => [Comment], { nullable: true })
  @OneToMany(
    type => Comment,
    comment => comment.parent,
  )
  replies: Comment[];

  @Field(type => Boolean)
  @Column({ default: false })
  hasReply: boolean;
}
