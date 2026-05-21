import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    console.log('verify-otp received:', { email, code, codeLength: code?.length });

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and code are required' },
        { status: 400 }
      );
    }

    if (code.length !== 4 || !/^\d+$/.test(code)) {
      console.log('Code validation failed:', { code, length: code?.length, type: typeof code });
      return NextResponse.json(
        { success: false, error: 'Invalid code format' },
        { status: 400 }
      );
    }

    const cookies = request.headers.get('cookie') || '';
    console.log('All cookies:', cookies);
    const otpCookie = cookies.split(';').find(c => c.trim().startsWith('otp_verify='));
    console.log('otpCookie found:', otpCookie);
    
    if (!otpCookie) {
      return NextResponse.json(
        { success: false, error: 'No verification code found. Please request a new code.' },
        { status: 400 }
      );
    }

    const encoded = decodeURIComponent(otpCookie.split('=')[1]);
    let otpData: { email: string; code: string; expiresAt: number };

    try {
      otpData = JSON.parse(Buffer.from(encoded, 'base64').toString('utf-8'));
      console.log('Parsed otpData:', otpData);
    } catch (e) {
      console.log('Failed to parse otpData:', e);
      return NextResponse.json(
        { success: false, error: 'Invalid verification data. Please request a new code.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    if (otpData.email !== normalizedEmail) {
      return NextResponse.json(
        { success: false, error: 'Email mismatch. Please use the same email.' },
        { status: 400 }
      );
    }

    if (Date.now() > otpData.expiresAt) {
      return NextResponse.json(
        { success: false, error: 'Verification code has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    if (otpData.code !== code) {
      return NextResponse.json(
        { success: false, error: 'Invalid code. Please try again.' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ 
      success: true,
      message: 'OTP verified successfully'
    });

    response.cookies.delete('otp_verify');

    return response;
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}