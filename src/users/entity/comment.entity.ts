import { CoreEntity } from 'src/common/entity/core.entity';
import { InputType, ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

@InputType('CommentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Comment extends CoreEntity {}
