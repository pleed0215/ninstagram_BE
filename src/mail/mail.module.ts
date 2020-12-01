import { DynamicModule, Global, Module } from '@nestjs/common';
import { MAIL_OPTIONS } from './mail.constant';
import { MailgunOptions } from './mail.interface';
import { MailService } from './mail.service';

@Module({})
@Global()
export class MailModule {
  static forRoot(options: MailgunOptions): DynamicModule {
    return {
      module: MailModule,
      providers: [
        {
          provide: MAIL_OPTIONS,
          useValue: options,
        },
        MailService,
      ],
      exports: [MAIL_OPTIONS, MailService],
    };
  }
}
