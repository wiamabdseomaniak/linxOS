import { NextResponse } from 'next/server';
import { createOTP } from '@/lib/auth/otp';
import { sendEmail, generateOTPEmailHtml } from '@/lib/email';

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    const { email } = body;
    console.log('Request-otp received email:', email);

    if (!email || !email.includes('@')) {
      console.log('Email validation failed:', { email });
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const result = await createOTP(email);
    console.log('createOTP result:', result);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    const html = generateOTPEmailHtml(result.code!, email);
    const emailSent = await sendEmail({
      to: email,
      subject: 'Votre code de vérification Linxos',
      html,
    });

    if (!emailSent) {
      return NextResponse.json(
        { success: false, error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const expiresAt = result.expiresAt!.getTime();

    const response = NextResponse.json({
      success: true,
      expiresAt: result.expiresAt,
      remainingResends: result.remainingResends,
    });

    const otpData = JSON.stringify({
      email: normalizedEmail,
      code: result.code,
      expiresAt,
    });
    
    const encoded = Buffer.from(otpData).toString('base64');
    
    response.cookies.set('otp_verify', encoded, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 300,
      path: '/',
    });

    console.log('Cookie set, encoded value:', encoded);

    return response;
  } catch (error) {
    console.error('Error in request-otp:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}