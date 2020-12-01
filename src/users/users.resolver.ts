import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import {
  CreateUserInput,
  CreateUserOutput,
  UserByIdOutput,
} from './dtos/users.dto';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly service: UsersService) {}
  @Mutation(type => CreateUserOutput)
  createUser(@Args('input') input: CreateUserInput): Promise<CreateUserOutput> {
    return this.service.createUser(input);
  }

  @Query(type => UserByIdOutput)
  userById(@Args('id') id: number): Promise<UserByIdOutput> {
    return this.service.getUser(id);
  }
}
