import { createParamDecorator, SetMetadata } from '@nestjs/common';
import { UserState } from 'src/users/entity/user.entity';

export type AllowedState = keyof typeof UserState | 'LOGIN_ANY';

export const State = (states: AllowedState[]) => SetMetadata('states', states);
