import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { AllowedState } from './state.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const states = this.reflector.get<AllowedState>(
      'states',
      context.getHandler(),
    );
    if (!states) return true;

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const { token } = gqlContext;
    let user = null;

    if (token) {
      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          user = await this.users.findOneOrFail(decoded['id']);
        }
      } catch (e) {
        user = null;
      }
    } else {
      user = null;
    }

    gqlContext['user'] = user;
    return (
      user && (states.includes(user.state) || states.includes('LOGIN_ANY'))
    );
  }
}
