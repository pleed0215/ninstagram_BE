import { Inject, Injectable } from '@nestjs/common';
import { JWT_OPTIONS } from './jwt.contant';
import { JwtModuleOptions } from './jwt.interface';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(
    @Inject(JWT_OPTIONS) private readonly jwtOptions: JwtModuleOptions,
  ) {}

  sign(userId: number): string {
    return jwt.sign({ id: userId }, this.jwtOptions.secretKey);
  }

  verify(token: string) {
    return jwt.verify(token, this.jwtOptions.secretKey);
  }
}
