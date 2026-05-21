import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const { to, subject, html, smtpFrom } = await request.json();

    const fromEmail = smtpFrom || process.env.SMTP_FROM || 'Linxos <noreply@linxos.com>';

    // Check if RESEND_API_KEY is configured
    if (!resend) {
      console.log('=== EMAIL (Resend not configured) ===');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('From:', fromEmail);
      console.log('--- HTML Preview ---');
      console.log(html.substring(0, 500) + '...');
      console.log('=========================');
      console.log('To send real emails, add RESEND_API_KEY to your .env.local file');
      return NextResponse.json({ success: true, message: 'Email logged to console (Resend not configured)' });
    }

    try {
      const data = await resend.emails.send({
        from: fromEmail,
        to: [to],
        subject: subject,
        html: html,
      });

      console.log('Email sent successfully via Resend:', data);
      return NextResponse.json({ success: true, data });
    } catch (resendError) {
      console.error('Resend error:', resendError);
      return NextResponse.json(
        { success: false, error: 'Failed to send email via Resend' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process email request' },
      { status: 500 }
    );
  }
}