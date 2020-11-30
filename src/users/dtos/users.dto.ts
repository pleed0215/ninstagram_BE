import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/common.dto';
import { User } from '../entity/user.entity';

@InputType()
export class CreateUserInput extends PickType(User, [
  'username',
  'email',
] as const) {}

@ObjectType()
export class CreateUserOutput extends CommonOutput {}
