import { Inject, Injectable } from '@nestjs/common';
import { MAIL_OPTIONS } from './mail.constant';
import { MailgunOptions } from './mail.interface';
import * as FormData from 'form-data';
import got from 'got';

@Injectable()
export class MailService {
  constructor(@Inject(MAIL_OPTIONS) private readonly options: MailgunOptions) {}

  async sendEmail(
    to: string,
    subject: string,
    user: string,
    emailData: Object,
    templateName = 'verification',
  ): Promise<boolean> {
    const form = new FormData();
    form.append('from', `Nuber-eats <pleed0215@${this.options.mailgunDomain}>`);
    form.append('to', to);
    form.append('subject', subject);
    form.append('template', templateName);
    Object.keys(emailData).forEach(key =>
      form.append(`v:${key}`, emailData[key]),
    );

    try {
      const response = await got.post(
        `https://api.mailgun.net/v3/${this.options.mailgunDomain}/messages`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.mailgunApiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async sendVerificationEmail(
    to: string,
    user: string,
    host: string,
    code: string,
  ): Promise<boolean> {
    return this.sendEmail(
      to,
      `Hello, ${user}! This is a verfication mail for Ninstagram!`,
      user,
      { host, code },
      'verification',
    );
  }
}
