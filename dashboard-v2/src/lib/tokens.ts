import sql from '@/lib/db';
import crypto from 'crypto';

export const generateVerificationToken = async (email: string) => {
  // 1. Generate a 6-digit numeric token
  const token = crypto.randomInt(100000, 999999).toString();
  
  // 2. Set expiry (15 minutes from now)
  const expires = new Date(new Date().getTime() + 15 * 60 * 1000);

  // 3. Clear existing tokens for this email
  await sql`DELETE FROM verification_tokens WHERE identifier = ${email}`;

  // 4. Store new token
  const [verificationToken] = await sql`
    INSERT INTO verification_tokens (identifier, token, expires)
    VALUES (${email}, ${token}, ${expires})
    RETURNING *
  `;

  return verificationToken;
};
