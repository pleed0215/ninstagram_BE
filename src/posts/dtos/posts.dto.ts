import {
  ArgsType,
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Length } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/common.dto';
import {
  PaginatedInput,
  PaginatedOutput,
} from 'src/common/dtos/pagination.dto';
import { Comment } from '../entities/comment.entity';
import { MyPost } from '../entities/post.entity';

@InputType()
export class CreatePostInput {
  @Field(type => String, { nullable: true })
  caption?: string;

  @Field(type => String, { nullable: true })
  location?: string;

  @Field(type => [String])
  files?: string[];
}

@ObjectType()
export class CreatePostOutput extends CommonOutput {}

@ArgsType()
export class PostIdOnly {
  @Field(type => Int)
  id: number;
}

@ObjectType()
export class SeePostOutput extends CommonOutput {
  @Field(type => MyPost, { nullable: true })
  post?: MyPost;
}

@ArgsType()
export class PostsByTermInput extends PaginatedInput {
  @Field(type => String)
  @Length(4)
  term: string;
}

@ObjectType()
export class PostsOutput extends PaginatedOutput {
  @Field(type => [MyPost], { nullable: true })
  posts?: MyPost[];
}

@InputType()
export class UpdatePostInput extends PartialType(
  PickType(MyPost, ['caption', 'location'] as const),
) {
  @Field(type => Int)
  id: number;
}

@ObjectType()
export class UpdatePostOutput extends CommonOutput {}

@ObjectType()
export class RemovePostOutput extends CommonOutput {}

@ArgsType()
export class AddFilesInput {
  @Field(type => Int)
  postId: number;

  @Field(type => [String])
  files: string[];
}

@ObjectType()
export class AddFilesOutput extends CommonOutput {}

@ArgsType()
export class RemoveFilesInput {
  @Field(type => Int)
  postId: number;

  @Field(type => [Int])
  fileIds: number[];
}

@ObjectType()
export class RemoveFilesOutput extends CommonOutput {}

@ObjectType()
export class SeeFeedOutput extends PaginatedOutput {
  @Field(type => [MyPost], { nullable: true })
  feed?: MyPost[];
}

@ObjectType()
export class ToggleLikeOutput extends CommonOutput {
  @Field(type => String, { nullable: true })
  message?: string;
}

@ObjectType()
export class LikedPostsOutput extends PaginatedOutput {
  @Field(type => [MyPost], { nullable: true })
  posts?: MyPost[];
}

@InputType()
export class CreateCommentInput {
  @Field(type => Int)
  postId: number;

  @Field(type => String)
  text: string;
}

@InputType()
export class CreateReplyCommentInput {
  @Field(type => Int)
  postId: number;

  @Field(type => Int)
  replyId: number;

  @Field(type => String)
  text: string;
}

@ObjectType()
export class CreateCommentOutput extends CommonOutput {}

@ObjectType()
export class CommentsOnPostOutput extends CommonOutput {
  @Field(type => [Comment], { nullable: true })
  comments?: Comment[];
}

@ObjectType()
export class CommentsByUserOutput extends CommonOutput {
  @Field(type => [Comment], { nullable: true })
  comments?: Comment[];
}

@ArgsType()
export class UpdateCommentInput {
  @Field(type => Int)
  id: number;

  @Field(type => String)
  text: string;
}

@ObjectType()
export class UpdateCommentOutput extends CommonOutput {}

@ArgsType()
export class RemoveCommentInput {
  @Field(type => Int)
  id: number;
}

@ObjectType()
export class RemoveCommentOutput extends CommonOutput {}
