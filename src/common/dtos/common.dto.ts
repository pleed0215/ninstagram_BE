import { Field } from '@nestjs/graphql';

export class CommonOutput {
  @Field(type => Boolean)
  ok: boolean;

  @Field(type => String, { nullable: true })
  error?: string;
}
