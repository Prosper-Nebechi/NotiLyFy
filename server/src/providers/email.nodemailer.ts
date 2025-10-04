import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or use custom SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendEmail(to: string, subject: string, text: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    });
    return info.messageId;
  } catch (err) {
    console.error("Email send error:", err);
    throw err;
  }
}
