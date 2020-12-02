import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommonOutput {
  @Field(type => Boolean)
  ok: boolean;

  @Field(type => String, { nullable: true })
  error?: string;
}

@ArgsType()
export class OnlyIdInput {
  @Field(type => Int)
  id: number;
}

@ArgsType()
export class OnlyIdPaginatedInput {
  @Field(type => Int, { defaultValue: 1 })
  page: number;

  @Field(type => Int)
  id: number;
}
