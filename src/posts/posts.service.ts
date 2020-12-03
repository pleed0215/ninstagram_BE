import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getSkipAndTake, getTotalPage } from 'src/common/common.util';
import { OnlyIdInput, OnlyIdPaginatedInput } from 'src/common/dtos/common.dto';
import { User } from 'src/users/entity/user.entity';
import { ILike, Repository } from 'typeorm';
import {
  AddFilesInput,
  AddFilesOutput,
  CommentsByUserOutput,
  CommentsOnPostOutput,
  CreateCommentInput,
  CreateCommentOutput,
  CreatePostInput,
  CreatePostOutput,
  CreateReplyCommentInput,
  LikedPostsOutput,
  PostIdOnly,
  PostsByTermInput,
  PostsOutput,
  RemoveCommentInput,
  RemoveCommentOutput,
  RemoveFilesInput,
  RemoveFilesOutput,
  RemovePostOutput,
  SeeFeedOutput,
  SeePostOutput,
  ToggleLikeOutput,
  UpdateCommentInput,
  UpdateCommentOutput,
  UpdatePostInput,
  UpdatePostOutput,
} from './dtos/posts.dto';
import { Comment } from './entities/comment.entity';
import { File } from './entities/file.entity';
import { Like } from './entities/like.entity';
import { MyPost } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(MyPost) private readonly posts: Repository<MyPost>,
    @InjectRepository(File) private readonly files: Repository<File>,
    @InjectRepository(Like) private readonly likes: Repository<Like>,
    @InjectRepository(Comment) private readonly comments: Repository<Comment>,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createPost(
    user: User,
    { caption, location, files }: CreatePostInput,
  ): Promise<CreatePostOutput> {
    try {
      if (files.length > 0) {
        const post = await this.posts.save(
          this.posts.create({ caption, location, writer: user }),
        );

        files.forEach(
          async file =>
            await this.files.save(this.files.create({ url: file, post })),
        );

        return {
          ok: true,
        };
      } else {
        throw Error('There is no photo files urls. Cannot upload a post.');
      }
    } catch (e) {
      return {
        ok: false,
        error: e.toString(),
      };
    }
  }

  async seePost({ id }: PostIdOnly): Promise<SeePostOutput> {
    try {
      const post = await this.posts.findOneOrFail(id, {
        relations: ['writer', 'files', 'likes', 'likes.user'],
      });

      return {
        ok: true,
        post,
      };
    } catch (e) {
      return {
        ok: false,
        error: e.toString(),
      };
    }
  }

  async postsByTerm({ term, page }: PostsByTermInput): Promise<PostsOutput> {
    try {
      const [posts, count] = await this.posts.findAndCount({
        where: [
          { location: ILike(`%${term}%`) },
          { caption: ILike(`%${term}%`) },
        ],
        relations: ['writer', 'files', 'likes', 'likes.user'],
        ...getSkipAndTake(page),
      });

      return {
        ok: true,
        totalCount: count,
        totalPage: getTotalPage(count),
        currentPage: page,
        posts,
      };
    } catch (e) {
      return {
        ok: true,
        error: e.toString(),
      };
    }
  }

  async updatePost(
    user: User,
    { id, location, caption }: UpdatePostInput,
  ): Promise<UpdatePostOutput> {
    try {
      const post = await this.posts.findOneOrFail(id);
      if (post.writerId !== user.id)
        throw Error(
          `User: ${user.email} is not writer of this post(id: ${post.id})`,
        );

      if (location) post.location = location;
      if (caption) post.caption = caption;

      await this.posts.save(post);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: e.toString(),
      };
    }
  }

  async removePost(user: User, { id }: PostIdOnly): Promise<RemovePostOutput> {
    try {
      const post = await this.posts.findOneOrFail(id);
      if (post.writerId !== user.id)
        throw Error(
          `User: ${user.email} is not writer of this post(id: ${post.id})`,
        );
      await this.posts.delete(post.id);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: e.toString(),
      };
    }
  }

  async addFilesToPost(
    user: User,
    { postId, files }: AddFilesInput,
  ): Promise<AddFilesOutput> {
    try {
      const post = await this.posts.findOneOrFail(postId);
      if (post.writerId !== user.id)
        throw Error(
          `User: ${user.email} is not writer of this post(id: ${post.id})`,
        );

      files.forEach(async file => {
        await this.files.save(
          this.files.create({
            url: file,
            post,
          }),
        );
      });

      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: true,
        error: e.toString(),
      };
    }
  }

  async removeFilesFromPost(
    user: User,
    { postId, fileIds }: RemoveFilesInput,
  ): Promise<RemoveFilesOutput> {
    try {
      const post = await this.posts.findOneOrFail(postId);
      if (post.writerId !== user.id)
        throw Error(
          `User: ${user.email} is not writer of this post(id: ${post.id})`,
        );

      fileIds.forEach(async id => await this.files.delete(id));

      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: e.toString(),
      };
    }
  }

  async seeFeed({ id, page }: OnlyIdPaginatedInput): Promise<SeeFeedOutput> {
    try {
      const user = await this.users.findOneOrFail(id, {
        relations: ['followers', 'followings'],
      });

      const [posts, count] = await this.posts.findAndCount({
        where: [
          ...user.followings.map(f => ({ writer: f })),
          ...user.followers.map(f => ({ writer: f })),
        ],
        relations: ['writer', 'files'],
        order: {
          createAt: 'DESC',
        },
      });

      return {
        ok: true,
        totalPage: getTotalPage(count),
        totalCount: count,
        currentPage: 1,
        feed: posts,
      };
    } catch (e) {
      return {
        ok: false,
        error: e.toString(),
      };
    }
  }

  async toggleLike(user: User, { id }: PostIdOnly): Promise<ToggleLikeOutput> {
    try {
      const post = await this.posts.findOneOrFail(id, { relations: ['likes'] });
      let isIn = false;

      for (const like of post.likes) {
        if (like.userId === user.id) {
          this.likes.delete(like.id);
          isIn = true;
          break;
        }
      }
      if (!isIn) {
        await this.likes.save(
          this.likes.create({
            user,
            post,
          }),
        );
      }

      return {
        ok: true,
        message: `User: ${user.email} ${isIn ? 'un' : ''}liked PostId: ${id}`,
      };
    } catch (e) {
      return {
        ok: true,
        error: e.toString(),
      };
    }
  }

  async likedPosts({
    id,
    page,
  }: OnlyIdPaginatedInput): Promise<LikedPostsOutput> {
    try {
      const user = await this.users.findOneOrFail(id, { relations: ['likes'] });
      const [posts, count] = await this.posts.findAndCount({
        where: [...user.likes.map(like => ({ id: like.postId }))],
        ...getSkipAndTake(page),
        relations: ['writer', 'files'],
        order: {
          createAt: 'DESC',
        },
      });

      return {
        ok: true,
        totalCount: count,
        totalPage: getTotalPage(count),
        currentPage: page,
        posts,
      };
    } catch (e) {
      return {
        ok: true,
        error: e.toString(),
      };
    }
  }

  async createComment(
    user: User,
    { postId, text }: CreateCommentInput,
  ): Promise<CreateCommentOutput> {
    try {
      const post = await this.posts.findOneOrFail(postId);

      if (text) {
        await this.comments.save(
          this.comments.create({
            user,
            post,
            text,
          }),
        );
      } else {
        throw Error('Comment text is null. Cannot make comment.');
      }

      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: e.toString(),
      };
    }
  }

  async createReplyComment(
    user: User,
    { postId, replyId, text }: CreateReplyCommentInput,
  ): Promise<CreateCommentOutput> {
    try {
      const post = await this.posts.findOneOrFail(postId);
      const reply = await this.comments.findOneOrFail(replyId);

      if (text) {
        await this.comments.save(
          await this.comments.create({
            user,
            post,
            parent: reply,
            text,
          }),
        );
        this.comments.update(reply.id, { hasReply: true });

        return {
          ok: true,
        };
      } else {
        throw Error('Comment text is null. Cannot make comment.');
      }
    } catch (e) {
      return {
        ok: false,
        error: e.toString(),
      };
    }
  }

  async commentsOnPost({ id }: PostIdOnly): Promise<CommentsOnPostOutput> {
    try {
      const post = await this.posts.findOneOrFail(id, {
        relations: ['comments', 'comments.replies'],
      });

      return {
        ok: true,
        comments: post.comments,
      };
    } catch (e) {
      return {
        ok: false,
        error: e.toString(),
      };
    }
  }

  async commentsByUser({ id }: OnlyIdInput): Promise<CommentsByUserOutput> {
    try {
      const user = await this.users.findOneOrFail(id, {
        relations: ['comments', 'comments.replies', 'comments.post'],
      });

      return {
        ok: true,
        comments: user.comments,
      };
    } catch (e) {
      return {
        ok: false,
        error: e.toString(),
      };
    }
  }

  async updateComment(
    user: User,
    { id, text }: UpdateCommentInput,
  ): Promise<UpdateCommentOutput> {
    try {
      const comment = await this.comments.findOneOrFail(id);
      if (user.id !== comment.userId)
        throw Error(
          `User: ${user.email} do not have permission to update this comment.`,
        );

      if (text) {
        await this.comments.update(id, { text });
      } else {
        throw Error('Cannot update comment cause of null type text');
      }

      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: e.toString(),
      };
    }
  }

  async removeComment(
    user: User,
    { id }: RemoveCommentInput,
  ): Promise<RemoveCommentOutput> {
    try {
      const comment = await this.comments.findOneOrFail(id, {
        relations: ['parent', 'parent.replies'],
      });
      if (user.id !== comment.userId)
        throw Error(
          `User: ${user.email} do not have permission to delete this comment.`,
        );
      await this.comments.delete(id);
      if (comment?.parent?.replies?.length === 1)
        this.comments.update(comment.parent.id, { hasReply: false });

      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: e.toString(),
      };
    }
  }
}
