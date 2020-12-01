import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entity/core.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  code: string;

  @OneToOne(
    (user: User) => User,
    user => user.verification,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  user: User;

  @BeforeInsert()
  makeVerifcationCode() {
    this.code = uuidv4();
  }
}
