import { DynamicModule, Global, Module } from '@nestjs/common';
import { JWT_OPTIONS } from './jwt.contant';
import { JwtModuleOptions } from './jwt.interface';
import { JwtService } from './jwt.service';

@Module({
  providers: [JwtService],
})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      providers: [
        {
          provide: JWT_OPTIONS,
          useValue: options,
        },
        JwtService,
      ],
      exports: [JwtService, JWT_OPTIONS],
    };
  }
}
