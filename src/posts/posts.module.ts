import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { MyPost } from './entities/post.entity';
import { PostsService } from './posts.service';
import { Comment } from './entities/comment.entity';
import { File } from './entities/file.entity';
import {
  PostsResolver,
  FilesResolver,
  LikesResolver,
  CommentsResolver,
} from './posts.resolver';
import { User } from 'src/users/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MyPost, Comment, Like, File, User])],
  providers: [
    PostsService,
    PostsResolver,
    FilesResolver,
    LikesResolver,
    CommentsResolver,
  ],
})
export class PostsModule {}
