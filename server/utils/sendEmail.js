import nodemailer from "nodemailer";

const formatDateTime = (date = new Date()) => {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
    timeZoneName: "short",
  }).format(date);
};

const createTransporter = () => {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, "");

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: { user, pass },
  });
};

const wrapEmailHtml = ({ heading, greeting, bodyHtml }) => `
  <div style="margin:0;padding:0;background:#f3f6fb;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f6fb;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.08);">
            <tr>
              <td style="background:#0f4c81;padding:24px 32px;">
                <h1 style="margin:0;color:#ffffff;font-size:22px;">EngiVerse</h1>
                <p style="margin:6px 0 0;color:#d6e8f8;font-size:13px;">Engineering Innovation Hub</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;">${heading}</h2>
                <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">${greeting}</p>
                ${bodyHtml}
                <p style="margin:24px 0 0;color:#334155;font-size:15px;line-height:1.6;">
                  Thank you for being part of EngiVerse!
                </p>
                <p style="margin:24px 0 0;color:#334155;font-size:15px;line-height:1.6;">
                  Best regards,<br />
                  <strong>EngiVerse Team</strong><br />
                  Engineering Innovation Hub
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
`;

const buildAuthEmail = ({ name, type, occurredAt }) => {
  const firstName = name?.split(" ")[0] || "there";
  const dateTime = formatDateTime(occurredAt);
  const isLogin = type === "login";

  const heading = isLogin
    ? "Successful login to your account"
    : "Welcome to EngiVerse – Engineering Innovation Hub!";

  const greeting = `Hello ${firstName},`;

  const intro = isLogin
    ? "We are pleased to inform you that you have successfully logged in to your EngiVerse account."
    : "Welcome to EngiVerse – Engineering Innovation Hub! We are pleased to inform you that you have successfully registered your EngiVerse account.";

  const securityNote = isLogin
    ? "If you did not perform this login, please secure your account by changing your password."
    : "If you did not create this account, please ignore this email or contact the EngiVerse team.";

  const bodyHtml = `
    <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">${intro}</p>
    <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">
      You can now explore engineering projects, discover internship opportunities, participate in events, connect with other students, and collaborate on innovative ideas.
    </p>
    <div style="margin:0 0 16px;padding:14px 16px;background:#eff6ff;border-left:4px solid #0f4c81;border-radius:6px;">
      <p style="margin:0;color:#0f172a;font-size:14px;line-height:1.6;">
        <strong>${isLogin ? "Login date and time:" : "Registration date and time:"}</strong><br />
        ${dateTime}
      </p>
    </div>
    <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;">${securityNote}</p>
  `;

  const text = [
    greeting,
    "",
    isLogin
      ? "Welcome to EngiVerse – Engineering Innovation Hub!"
      : heading,
    "",
    intro,
    "",
    "You can now explore engineering projects, discover internship opportunities, participate in events, connect with other students, and collaborate on innovative ideas.",
    "",
    `${isLogin ? "Login date and time:" : "Registration date and time:"} ${dateTime}`,
    "",
    securityNote,
    "",
    "Thank you for being part of EngiVerse!",
    "",
    "Best regards,",
    "EngiVerse Team",
    "Engineering Innovation Hub",
  ].join("\n");

  return {
    subject: isLogin
      ? "Successful login to your EngiVerse account"
      : "Welcome to EngiVerse – Engineering Innovation Hub!",
    html: wrapEmailHtml({ heading, greeting, bodyHtml }),
    text,
  };
};

export const sendAuthEmail = async ({ to, name, type }) => {
  const transporter = createTransporter();

  if (!transporter) {
    throw new Error(
      "Email is not configured. Set EMAIL_USER and EMAIL_PASS in server/.env"
    );
  }

  const occurredAt = new Date();
  const { subject, html, text } = buildAuthEmail({ name, type, occurredAt });
  const sender = process.env.EMAIL_USER.trim();

  const info = await transporter.sendMail({
    from: {
      name: "EngiVerse Team",
      address: sender,
    },
    to,
    subject,
    text,
    html,
  });

  console.log(
    `Auth email (${type}) sent to ${to} | messageId=${info.messageId} | response=${info.response}`
  );

  return info;
};
