import { Args, Mutation, Resolver, Query, Int } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth.decorator';
import { State } from 'src/auth/state.decorator';
import { OnlyIdInput, OnlyIdPaginatedInput } from 'src/common/dtos/common.dto';
import {
  AddFilesInput,
  AddFilesOutput,
  CreateCommentInput,
  CreateCommentOutput,
  CreatePostInput,
  CreatePostOutput,
  CreateReplyCommentInput,
  CommentsOnPostOutput,
  CommentsByUserOutput,
  LikedPostsOutput,
  PostIdOnly,
  PostsByTermInput,
  PostsOutput,
  RemoveFilesInput,
  RemoveFilesOutput,
  RemovePostOutput,
  SeeFeedOutput,
  SeePostOutput,
  ToggleLikeOutput,
  UpdatePostInput,
  UpdatePostOutput,
  RemoveCommentOutput,
  RemoveCommentInput,
  UpdateCommentInput,
  UpdateCommentOutput,
} from './dtos/posts.dto';
import { Comment } from './entities/comment.entity';
import { File } from './entities/file.entity';
import { Like } from './entities/like.entity';
import { MyPost } from './entities/post.entity';
import { PostsService } from './posts.service';

@Resolver(of => MyPost)
export class PostsResolver {
  constructor(private readonly service: PostsService) {}

  @Mutation(type => CreatePostOutput)
  @State(['LOGIN_ANY'])
  createPost(
    @AuthUser() user,
    @Args('input') input: CreatePostInput,
  ): Promise<CreatePostOutput> {
    return this.service.createPost(user, input);
  }

  @Query(type => SeePostOutput)
  seePost(@Args() input: PostIdOnly): Promise<SeePostOutput> {
    return this.service.seePost(input);
  }

  @Query(type => PostsOutput)
  postsByTerm(@Args() input: PostsByTermInput): Promise<PostsOutput> {
    return this.service.postsByTerm(input);
  }

  @Mutation(type => UpdatePostOutput)
  @State(['LOGIN_ANY'])
  updatePost(
    @AuthUser() user,
    @Args('input') input: UpdatePostInput,
  ): Promise<UpdatePostOutput> {
    return this.service.updatePost(user, input);
  }

  @Mutation(type => RemovePostOutput)
  @State(['LOGIN_ANY'])
  removePost(
    @AuthUser() user,
    @Args() input: PostIdOnly,
  ): Promise<RemovePostOutput> {
    return this.service.removePost(user, input);
  }

  @Query(type => SeeFeedOutput)
  @State(['LOGIN_ANY'])
  seeMyFeed(
    @AuthUser() user,
    @Args('page', { defaultValue: 1, type: () => Int }) page: number,
  ): Promise<SeeFeedOutput> {
    return this.service.seeFeed({ id: user.id, page });
  }

  @Query(type => SeeFeedOutput)
  seeFeed(@Args() input: OnlyIdPaginatedInput): Promise<SeeFeedOutput> {
    return this.service.seeFeed(input);
  }
}

@Resolver(of => File)
export class FilesResolver {
  constructor(private readonly service: PostsService) {}

  @Mutation(type => AddFilesOutput)
  @State(['LOGIN_ANY'])
  addFiles(
    @AuthUser() user,
    @Args() input: AddFilesInput,
  ): Promise<AddFilesOutput> {
    return this.service.addFilesToPost(user, input);
  }

  @Mutation(type => RemoveFilesOutput)
  @State(['LOGIN_ANY'])
  removeFiles(
    @AuthUser() user,
    @Args() input: RemoveFilesInput,
  ): Promise<RemoveFilesOutput> {
    return this.service.removeFilesFromPost(user, input);
  }
}

@Resolver(of => Like)
export class LikesResolver {
  constructor(private readonly service: PostsService) {}

  @Mutation(type => ToggleLikeOutput)
  @State(['LOGIN_ANY'])
  toggleLike(
    @AuthUser() user,
    @Args() input: PostIdOnly,
  ): Promise<ToggleLikeOutput> {
    return this.service.toggleLike(user, input);
  }

  @Query(type => LikedPostsOutput)
  @State(['LOGIN_ANY'])
  myLikedPosts(
    @AuthUser() user,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
  ): Promise<LikedPostsOutput> {
    return this.service.likedPosts({ id: user.id, page });
  }

  @Query(type => LikedPostsOutput)
  likedPosts(@Args() input: OnlyIdPaginatedInput): Promise<LikedPostsOutput> {
    return this.service.likedPosts(input);
  }
}

@Resolver(of => Comment)
export class CommentsResolver {
  constructor(private readonly service: PostsService) {}

  @Mutation(type => CreateCommentOutput)
  @State(['LOGIN_ANY'])
  createComment(
    @AuthUser() user,
    @Args('input') input: CreateCommentInput,
  ): Promise<CreateCommentOutput> {
    return this.service.createComment(user, input);
  }

  @Mutation(type => CreateCommentOutput)
  @State(['LOGIN_ANY'])
  createReplyComment(
    @AuthUser() user,
    @Args('input') input: CreateReplyCommentInput,
  ): Promise<CreateCommentOutput> {
    return this.service.createReplyComment(user, input);
  }

  @Query(type => CommentsOnPostOutput)
  commentsOnPost(input: PostIdOnly): Promise<CommentsOnPostOutput> {
    return this.service.commentsOnPost(input);
  }

  @Query(type => CommentsByUserOutput)
  commentsByUser(input: OnlyIdInput): Promise<CommentsByUserOutput> {
    return this.service.commentsByUser(input);
  }

  @Query(type => CommentsByUserOutput)
  @State(['LOGIN_ANY'])
  myComments(@AuthUser() user): Promise<CommentsByUserOutput> {
    return this.service.commentsByUser({ id: user.id });
  }

  @Mutation(type => RemoveCommentOutput)
  @State(['LOGIN_ANY'])
  removeComment(
    @AuthUser() user,
    @Args() input: RemoveCommentInput,
  ): Promise<RemoveCommentOutput> {
    return this.service.removeComment(user, input);
  }

  @Mutation(type => UpdateCommentOutput)
  @State(['LOGIN_ANY'])
  updateComment(
    @AuthUser() user,
    @Args() input: UpdateCommentInput,
  ): Promise<UpdateCommentOutput> {
    return this.service.updateComment(user, input);
  }
}
