import { sign } from "hono/jwt";
import { TimeSpan } from "lucia";

import { env } from "~/lib/env";
import { resend } from "~/lib/resend";

export const sendEmailVerificationLink = async (
  email: string,
  userId: string
) => {
  /**
   * Generate email verification token that expires in 12h
   */
  const emailVerificationToken = await sign(
    {
      id: userId,
      email: email,
      exp: Math.round(Date.now() / 1000) + new TimeSpan(12, "h").seconds(),
    },
    env.EMAIL_VERIFICATION_SECRET
  );

  const emailVerificationUrl = `${env.SERVER_URL}/api/auth/email-verify?token=${emailVerificationToken}`;

  console.log(`[EMAIL] Email verification link sent to ${email}`);

  const { data, error } = await resend.emails.send({
    from: "Fuzzie <noreply@test.nayz.fr>",
    to: [email],
    subject: "Verify your email",
    html: `<p>Click <a href='${emailVerificationUrl}'>here</a> to verify yourr email.</p>`,
  });
};
