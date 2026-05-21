interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const smtpFrom = process.env.SMTP_FROM || 'noreply@linxos.com';

  if (!smtpHost || !smtpUser || !smtpPassword) {
    console.warn('SMTP not configured. Using console fallback for email:', { to, subject });
    console.log('Email content:', html);
    return true;
  }

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html, smtpFrom }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function generateOTPEmailHtml(code: string, email: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vérification - Linxos</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
            <tr>
              <td style="padding: 32px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding-bottom: 24px;">
                      <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #0f172a;">LINXOS</h1>
                      <p style="margin: 8px 0 0; font-size: 14px; color: #64748b;">Logistique & Sponsoring</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 24px 0; text-align: center;">
                      <h2 style="margin: 0; font-size: 24px; font-weight: 600; color: #0f172a;">Code de vérification</h2>
                      <p style="margin: 12px 0 0; font-size: 14px; color: #64748b;">
                        Entrez ce code pour vérifier votre adresse email
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 24px;">
                      <div style="display: inline-block; background: linear-gradient(135deg, #bfd614 0%, #6b8a1e 100%); border-radius: 12px; padding: 20px 32px;">
                        <span style="font-size: 36px; font-weight: 700; color: #0f172a; letter-spacing: 8px;">${code}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 16px 0; text-align: center;">
                      <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                        Ce code expire dans <strong>5 minutes</strong>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 24px 0; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                        Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.<br>
                        Ne partagez jamais ce code avec quelqu'un d'autre.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <p style="margin: 24px 0 0; font-size: 12px; color: #94a3b8;">
            © 2026 LINXOS. Tous droits réservés.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}