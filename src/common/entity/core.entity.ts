import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsNumber } from 'class-validator';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class CoreEntity {
  @Field((type) => Number)
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Field((type) => Date)
  @CreateDateColumn()
  @IsDate()
  createAt: Date;

  @Field((type) => Date)
  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;
}
