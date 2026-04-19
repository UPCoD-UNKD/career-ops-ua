import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({ 
    apiKey: process.env.BREVO_API_KEY || ''
});

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: "Verify your Career-Ops account",
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #09090b; color: #ffffff; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; padding: 12px; background-color: #f59e0b; border-radius: 12px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
          </div>
          <h1 style="font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 8px;">Verify your identity</h1>
          <p style="color: rgba(255,255,255,0.6); text-align: center; margin-bottom: 32px;">Enter the following 6-digit code to activate your AI career dashboard.</p>
          
          <div style="background-color: rgba(255,255,255,0.05); padding: 24px; border-radius: 16px; text-align: center; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 32px;">
            <span style="font-size: 48px; font-weight: bold; letter-spacing: 8px; color: #f59e0b; font-family: monospace;">${token}</span>
          </div>
          
          <p style="color: rgba(255,255,255,0.4); font-size: 12px; text-align: center;">If you didn't request this code, you can safely ignore this email. This code expires in 15 minutes.</p>
          
          <div style="margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; text-align: center;">
            <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.2);">Career-Ops Infrastructure v2.0</span>
          </div>
        </div>
      `,
      sender: { "name": "Career-Ops", "email": "verify@career-ops.pro" },
      to: [{ "email": email }]
    });
    
    console.log('OTP Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to send OTP Email:', error);
    throw new Error("Failed to send verification email.");
  }
};
