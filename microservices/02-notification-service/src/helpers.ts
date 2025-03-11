import path from 'path';

import { IEmailLocals, winstonLogger } from '@peter-lazarov/nodejs-reacjs-microservices-helper-library';
import { Logger } from 'winston';
//import { config } from '@notifications/config';
require('dotenv').config({ path: '.env.dev' });
import nodemailer, { Transporter } from 'nodemailer';
import Email from 'email-templates';

const log: Logger = winstonLogger(process.env.ELASTIC_SEARCH_URL as string, 'mailTransportHelper', 'debug');

async function emailTemplates(template: string, receiver: string, locals: IEmailLocals): Promise<void> {
  try {   
    const smtpTransport: Transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASSWORD
      }
    });
    const email: Email = new Email({
      message: {
        from: `Jobber App <${process.env.SENDER_EMAIL}>`
      },
      send: true,
      preview: false,
      transport: smtpTransport,
      views: {
        options: {
          extension: 'ejs'
        }
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../build')
        }
      }
    });

    await email.send({
      template: path.join(__dirname, '..', 'src/emails', template),
      message: { to: receiver },
      locals
    });
  } catch (error) {
    log.error(error);
  }
}

export { emailTemplates };
