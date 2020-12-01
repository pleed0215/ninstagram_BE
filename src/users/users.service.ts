import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateUserInput,
  CreateUserOutput,
  UserByIdOutput,
} from './dtos/users.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createUser({
    email,
    username,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      await this.users.save(
        this.users.create({
          email,
          username,
        }),
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
}
