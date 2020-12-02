import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from './common.dto';

@ObjectType()
export class PaginatedOutput extends CommonOutput {
  @Field(type => Int, { nullable: true })
  totalCount?: number;

  @Field(type => Int, { nullable: true })
  totalPage?: number;

  @Field(type => Int, { nullable: true })
  currentPage?: number;
}

@ArgsType()
export class PaginatedInput {
  @Field(type => Int, { defaultValue: 1 })
  page: number;
}
