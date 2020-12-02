import {
  ArgsType,
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CommonModule } from 'src/common/common.module';
import { CommonOutput } from 'src/common/dtos/common.dto';
import {
  PaginatedInput,
  PaginatedOutput,
} from 'src/common/dtos/pagination.dto';
import { User } from '../entity/user.entity';

@InputType()
export class CreateUserInput extends PickType(User, [
  'username',
  'email',
] as const) {
  @Field(type => String)
  password: string;

  @Field(type => String, { nullable: true })
  firstName?: string;

  @Field(type => String, { nullable: true })
  lastName?: string;
}

@ObjectType()
export class CreateUserOutput extends CommonOutput {}

@ArgsType()
export class UsersByTermInput extends PaginatedInput {
  @Field(type => String)
  term: string;
}

@ObjectType()
export class UserByIdOutput extends CommonOutput {
  @Field(type => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class UsersByTermOutput extends PaginatedOutput {
  @Field(type => [User], { nullable: true })
  users?: User[];
}

@ArgsType()
export class LoginInput {
  @Field(type => String)
  email: string;

  @Field(type => String)
  password: string;
}

@ObjectType()
export class LoginOutput extends CommonOutput {
  @Field(type => String, { nullable: true })
  token?: string;
}

@InputType()
export class UpdateProfileInput extends PartialType(
  PickType(User, [
    'email',
    'username',
    'bio',
    'firstName',
    'lastName',
  ] as const),
) {}

@ObjectType()
export class UpdateProfileOutput extends CommonOutput {}

@ArgsType()
export class VerfiyInput {
  @Field(type => String)
  code: string;
}

@ObjectType()
export class VerfiyOutput extends CommonOutput {
  @Field(type => User, { nullable: true })
  user?: User;
}

@ArgsType()
export class ToggleFollowInput {
  @Field(type => Int)
  id: number;
}

@ObjectType()
export class ToggleFollowOutput extends CommonOutput {
  @Field(type => String, { nullable: true })
  message?: string;
}

@ObjectType()
export class FollowersOutput extends CommonOutput {
  @Field(type => [User], { nullable: true })
  followers?: User[];
}

@ObjectType()
export class FollowingsOutput extends CommonOutput {
  @Field(type => [User], { nullable: true })
  followings?: User[];
}
