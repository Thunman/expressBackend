import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text }) => {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_PROVIDER,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  let info = await transporter.sendMail({
    from: "AdminBrickBreaker",
    to: to,
    subject: subject,
    text: text,
  });
};
