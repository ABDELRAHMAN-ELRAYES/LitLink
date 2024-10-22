import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
export const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  host: process.env.MAIL_HOST,
  port: (process.env.MAIL_PORT || 587) as number,
  secure: false,
  auth: {
    user: process.env.COMPANY_GMAIL,
    pass: process.env.COMPANY_GMAIL_PASSWORD,
  },
});
export const emailOptions = {
  from: process.env.COMPANY_GMAIL, // sender address
  to: 'default',
  subject: 'Travgo | Reset password ✔',
  text: 'hello world?',
  html: '<b>Hello world?</b>',
};
export const sendEmail = async (
  transporter: Transporter,
  emailOptions: SendMailOptions
) => {
  await transporter.sendMail(emailOptions);
};
