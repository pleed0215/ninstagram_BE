import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { CommonModule } from './common/common.module';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entity/user.entity';
import { MailModule } from './mail/mail.module';
import { Verification } from './users/entity/verification.entity';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { ChatsModule } from './chats/chats.module';
import { MyPost } from './posts/entities/post.entity';
import { Like } from './posts/entities/like.entity';
import { Message } from './chats/entities/message.entity';
import { ChatRoom } from './chats/entities/chatroom.entity';

// SECRET_KEY=vxnK3hspvE6E4NCFtk9D2TZ3tdahtLuk
// MAILGUN_APIK
// EY=dc5227789785
// 38be33a08b2a9e1
// 9d7d7-4d6406
// 32-2c4fe
// b39

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.test.env',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('dev', 'prod', 'test')
          .default('dev'),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        MARIADB_HOST: Joi.string().required(),
        MARIADB_PORT: Joi.string().required(),
        MARIADB_USER: Joi.string().required(),
        MARIADB_PASSWORD: Joi.string().required(),
        MAILGUN_APIKEY: Joi.string().required(),
        MAILGUN_URL: Joi.string().required(),
        MAILGUN_DOMAIN: Joi.string().required(),
        MAILGUN_EMAIL: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        SECRET_KEY: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      include: [UsersModule, PostsModule, ChatsModule],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, connection }) => {
        return {
          token: req ? req.headers['x-jwt'] : connection.context['x-jwt'],
        };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      /*type: 'mariadb',
      host: process.env.MARIADB_HOST,
      port: parseInt(process.env.MARIADB_PORT),
      username: process.env.MARIADB_USER,
      password: process.env.MARIADB_PASSWORD,*/
      database: `${process.env.DB_NAME}${
        process.env.NODE_ENV === 'test' ? '-test' : ''
      }`,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: process.env.NODE_ENV === 'dev',
    }),
    CommonModule,
    UsersModule,
    MailModule.forRoot({
      mailgunApiKey: process.env.MAILGUN_APIKEY,
      mailgunDomain: process.env.MAILGUN_DOMAIN,
      mailgunEmail: process.env.MAILGUN_EMAIL,
    }),
    JwtModule.forRoot({ secretKey: process.env.SECRET_KEY }),
    AuthModule,
    PostsModule,
    ChatsModule,
  ],
  providers: [],
})
export class AppModule {}

/*POSTGRES_PASSWORD=dldmsejr1
POSTGRES_HOST=222.104.218.3
POSTGRES_PORT=32788
POSTGRES_USER=postgres
DB_NAME=ninstagram
MAILGUN_URL=https://api.mailgun.net/v3/sandbox857418504ffe4144bc9c19e3d65f2430.mailgun.org
MAILGUN_DOMAIN=sandbox857418504ffe4144bc9c19e3d65f2430.mailgun.org
MAILGUN_EMAIL=pleed0215@yoyang.io
SECRET_KEY=vxnK3hspvE6E4NCFtk9D2TZ3tdahtLuk*/
