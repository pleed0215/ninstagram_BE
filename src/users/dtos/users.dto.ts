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
import { PaginatedOutput } from 'src/common/dtos/pagination.dto';
import { User } from '../entity/user.entity';

@InputType()
export class CreateUserInput extends PickType(User, [
  'username',
  'email',
] as const) {
  @Field(type => String)
  password: string;
}

@ObjectType()
export class CreateUserOutput extends CommonOutput {}

@InputType()
export class SearchByUsernameInput extends PickType(User, [
  'username',
] as const) {}

@ObjectType()
export class UserByIdOutput extends CommonOutput {
  @Field(type => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class UsersByUsernameOutput extends PaginatedOutput {
  @Field(type => [User], { nullable: true })
  users?: User;
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
  PickType(User, ['email', 'username', 'bio'] as const),
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
