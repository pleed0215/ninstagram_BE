import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { PaginatedOutput } from 'src/common/dtos/pagination.dto';
import { User } from '../entity/user.entity';

@InputType()
export class CreateUserInput extends PickType(User, [
  'username',
  'email',
] as const) {}

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
