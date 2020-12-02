import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entity/core.entity';
import { User } from 'src/users/entity/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { MyPost } from './post.entity';

@InputType('FileInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class File extends CoreEntity {
  @Field(type => MyPost)
  @ManyToOne(
    type => MyPost,
    (post: MyPost) => post.files,
    { onDelete: 'CASCADE' },
  )
  post: MyPost;

  @RelationId((file: File) => file.post)
  postId: number;

  @Field(type => String)
  @Column()
  url: string;
}
