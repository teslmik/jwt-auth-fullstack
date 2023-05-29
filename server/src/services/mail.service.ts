import NodeMailer from 'nodemailer';

type EmailProperties = {
  to: string;
  link: string;
};

class MailService {
  private nodeMailer: typeof NodeMailer;

  public constructor(nodeMailer: typeof NodeMailer) {
    this.nodeMailer = nodeMailer;
  }

  private generateTransporterConfig() {
    return {
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASSWORD as string,
      },
    };
  }

  private createTransporter(): NodeMailer.Transporter {
    const transporterConfig = this.generateTransporterConfig();
    return this.nodeMailer.createTransport(transporterConfig);
  }

  private generateEmailConfig({
    to,
    link,
  }: EmailProperties) {
    return {
      from: process.env.SMTP_USER as string,
      to,
      subject: 'Activation account on ' + process.env.API_URL,
      text: '',
      html: `
        <div>
          <h1>For activate account follow this link</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
    };
  }

  public async sendActivationMail({
    to,
    link,
  }: EmailProperties): Promise<unknown> {
    const transporter = this.createTransporter();
    const emailConfig = this.generateEmailConfig({
      to,
      link,
    });
    return await transporter.sendMail(emailConfig);
  }
}

export const mailService = new MailService(NodeMailer);