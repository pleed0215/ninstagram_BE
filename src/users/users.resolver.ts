import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth.decorator';
import { State } from 'src/auth/state.decorator';
import {
  CreateUserInput,
  CreateUserOutput,
  LoginInput,
  LoginOutput,
  UpdateProfileInput,
  UpdateProfileOutput,
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
  @State(['LOGIN_ANY'])
  userById(@Args('id') id: number): Promise<UserByIdOutput> {
    return this.service.getUser(id);
  }

  @Query(type => UserByIdOutput)
  @State(['LOGIN_ANY'])
  me(@AuthUser() user: User): Promise<UserByIdOutput> {
    return this.service.getUser(user.id);
  }

  @Mutation(type => LoginOutput)
  login(@Args() input: LoginInput): Promise<LoginOutput> {
    return this.service.login(input);
  }

  @Mutation(type => UpdateProfileOutput)
  @State(['LOGIN_ANY'])
  updateProfile(
    @AuthUser() user: User,
    @Args('input') input: UpdateProfileInput,
  ): Promise<UpdateProfileOutput> {
    return this.service.updateProfile(user, input);
  }
}
