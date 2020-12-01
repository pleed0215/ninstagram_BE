import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HOST_NAME } from 'src/common/common.contant';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import {
  CreateUserInput,
  CreateUserOutput,
  LoginInput,
  LoginOutput,
  UpdateProfileInput,
  UpdateProfileOutput,
  UserByIdOutput,
  VerfiyOutput,
} from './dtos/users.dto';
import { User } from './entity/user.entity';
import { Verification } from './entity/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser({
    email,
    username,
    password,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const user = await this.users.save(
        this.users.create({
          email,
          username,
          password,
        }),
      );

      const verification = await this.verifications.save(
        this.verifications.create({
          user,
        }),
      );

      await this.mailService.sendVerificationEmail(
        email,
        username,
        HOST_NAME,
        verification.code,
      );

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.toString(),
      };
    }
  }

  async getUser(id: number): Promise<UserByIdOutput> {
    try {
      const user = await this.users.findOneOrFail(id);
      return {
        ok: true,
        user,
      };
    } catch (e) {
      return {
        ok: false,
        error: e.toString(),
      };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOneOrFail(
        { email },
        { select: ['password', 'id', 'verified', 'email'] },
      );

      /* for devlopement, it is commented.
      if (!user.verified)
        throw Error(`User: ${user.email} has a problem with email verification. Cannot login.`);
      */

      if (await user.checkPassword(password)) {
        return {
          ok: true,
          token: this.jwtService.sign(user.id),
        };
      } else {
        throw Error(`User: ${user.email} password authentication is failed.`);
      }
    } catch (e) {
      return {
        ok: false,
        error: e.toString(),
      };
    }
  }

  async verifyUser(code: string): Promise<VerfiyOutput> {
    try {
      const verification = await this.verifications.findOneOrFail(
        { code },
        { relations: ['user'] },
      );
      if (code === verification.code) {
        await this.users.update(verification.userId, { verified: true });
        await this.verifications.delete(verification.id);
      }
      return {
        ok: true,
        user: verification.user,
      };
    } catch (e) {
      return {
        ok: false,
        error: e.toString(),
      };
    }
  }

  async updateProfile(
    user: User,
    { email, username, bio }: UpdateProfileInput,
  ): Promise<UpdateProfileOutput> {
    try {
      if (username) user.username = username;
      if (bio) user.bio = bio;
      if (email) {
        if (!user.verified)
          throw Error(
            `User: ${user.email} is not verified. Cannot change email address.`,
          );
        const verification = await this.verifications.save(
          this.verifications.create({ user }),
        );
        user.email = email;
        user.verified = false;
        user.verification = verification;

        await this.mailService.sendVerificationEmail(
          email,
          user.username,
          HOST_NAME,
          verification.code,
        );
      }

      await this.users.save(user);

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
