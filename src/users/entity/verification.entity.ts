import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entity/core.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  RelationId,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column({ unique: true })
  code: string;

  @OneToOne(
    (user: User) => User,
    user => user.verification,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  user: User;

  @RelationId((v: Verification) => v.user)
  userId: number;

  @BeforeInsert()
  makeVerifcationCode() {
    this.code = uuidv4();
  }
}
