import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';

interface EmailConfig {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
}

class EmailModule {
  private transporter: nodemailer.Transporter;

  constructor(config: nodemailer.TransportOptions) {
    this.transporter = nodemailer.createTransport(config);
  }

  async sendEmail(templateName: string, data: any, options: EmailOptions): Promise<EmailConfig> {
    try {
      const emailContent = await this.parseTemplate(templateName, data);

      const mailOptions: nodemailer.SendMailOptions = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: emailContent.text,
        html: emailContent.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw error;
    }
  }

  private async parseTemplate(templateName: string, data: any): Promise<{ text: string; html: string }> {
    const templatePath = path.join(__dirname, 'templates', templateName);

    try {
      const textTemplate = await fs.readFile(`${templatePath}/text.hbs`, 'utf-8');
      const htmlTemplate = await fs.readFile(`${templatePath}/html.hbs`, 'utf-8');

      const compiledTextTemplate = handlebars.compile(textTemplate);
      const compiledHtmlTemplate = handlebars.compile(htmlTemplate);

      const textContent = compiledTextTemplate(data);
      const htmlContent = compiledHtmlTemplate(data);

      return { text: textContent, html: htmlContent };
    } catch (error) {
      console.error('Error reading or compiling template:', error);
      throw error;
    }
  }
}

export default EmailModule;
