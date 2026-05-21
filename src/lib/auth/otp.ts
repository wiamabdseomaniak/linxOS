/**
 * OTP Authentication Module
 * 
 * This module handles one-time password (OTP) generation and verification.
 * Uses in-memory storage for OTP codes (use Redis or database in production).
 */

import bcrypt from 'bcryptjs';

const OTP_LENGTH = 4;
const OTP_EXPIRY_MINUTES = 5;
const MAX_VERIFICATION_ATTEMPTS = 5;
const MAX_RESEND_ATTEMPTS = 3;
const RESEND_COOLDOWN_SECONDS = 60;

// In-memory OTP storage (use Redis or database in production)
const otpStore = new Map<string, {
  code: string;
  codeHash: string;
  expiresAt: number;
  attempts: number;
  resendAttempts: number;
  createdAt: number;
}>();

/**
 * Generates a secure 4-digit numeric OTP code
 */
function generateSecureCode(): string {
  const array = new Uint8Array(4);
  crypto.getRandomValues(array);
  const code = Array.from(array, (byte) => byte % 10).join('');
  return code.slice(0, OTP_LENGTH);
}

/**
 * Hashes the OTP code using bcrypt
 */
async function hashCode(code: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(code, salt);
}

/**
 * Verifies a code against its hash
 */
async function verifyCodeHash(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash);
}

export interface CreateOTPResult {
  success: boolean;
  code?: string;
  expiresAt?: Date;
  error?: string;
  remainingResends?: number;
  cooldownSeconds?: number;
}

export interface VerifyOTPResult {
  success: boolean;
  error?: string;
  remainingAttempts?: number;
}

/**
 * Creates a new OTP for the given email address
 * @param email - User's email address
 * @returns Result containing the OTP code and metadata
 */
export async function createOTP(email: string): Promise<CreateOTPResult> {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const now = Date.now();
    
    const existingOTP = otpStore.get(normalizedEmail);
    
    if (existingOTP) {
      const timeSinceCreated = now - existingOTP.createdAt;
      
      if (existingOTP.resendAttempts >= MAX_RESEND_ATTEMPTS) {
        return { 
          success: false, 
          error: 'Maximum resend attempts reached. Please try again later.',
          remainingResends: 0
        };
      }
      
      if (timeSinceCreated < RESEND_COOLDOWN_SECONDS * 1000) {
        const timeUntilResend = Math.ceil((RESEND_COOLDOWN_SECONDS * 1000 - timeSinceCreated) / 1000);
        return { 
          success: false, 
          error: `Please wait ${timeUntilResend} seconds before requesting a new code.`,
          cooldownSeconds: timeUntilResend,
          remainingResends: MAX_RESEND_ATTEMPTS - existingOTP.resendAttempts
        };
      }
      
      existingOTP.resendAttempts += 1;
      existingOTP.createdAt = now;
    }
    
    const code = generateSecureCode();
    const expiresAt = new Date(now + OTP_EXPIRY_MINUTES * 60 * 1000);
    const codeHash = await hashCode(code);
    
    otpStore.set(normalizedEmail, {
      code,
      codeHash,
      expiresAt: expiresAt.getTime(),
      attempts: 0,
      resendAttempts: existingOTP ? existingOTP.resendAttempts : 0,
      createdAt: now,
    });
    
    const remainingResends = MAX_RESEND_ATTEMPTS - (existingOTP ? existingOTP.resendAttempts + 1 : 0);
    
    console.log('OTP generated for', normalizedEmail, 'code:', code);
    
    return { success: true, code, expiresAt, remainingResends };
  } catch (error) {
    console.error('Error in createOTP:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/**
 * Verifies an OTP code for the given email
 * @param email - User's email address
 * @param code - OTP code to verify
 * @returns Result indicating success or failure
 */
export async function verifyOTP(email: string, code: string): Promise<VerifyOTPResult> {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    
    const storedOTP = otpStore.get(normalizedEmail);
    
    if (!storedOTP) {
      return { success: false, error: 'No verification code found. Please request a new code.' };
    }
    
    const now = Date.now();
    
    if (now > storedOTP.expiresAt) {
      otpStore.delete(normalizedEmail);
      return { success: false, error: 'Verification code has expired. Please request a new code.' };
    }
    
    if (storedOTP.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      return { success: false, error: 'Maximum verification attempts reached. Please request a new code.' };
    }
    
    const isValid = await verifyCodeHash(code, storedOTP.codeHash);
    
    if (!isValid) {
      storedOTP.attempts += 1;
      const remainingAttempts = MAX_VERIFICATION_ATTEMPTS - storedOTP.attempts;
      
      if (remainingAttempts <= 0) {
        otpStore.delete(normalizedEmail);
        return { success: false, error: 'Maximum verification attempts reached. Please request a new code.' };
      }
      
      return { success: false, error: `Invalid code. ${remainingAttempts} attempts remaining.`, remainingAttempts };
    }
    
    otpStore.delete(normalizedEmail);
    
    return { success: true };
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/**
 * Cleanup function for expired OTPs
 * Call this periodically to clean up old OTPs from memory
 */
export function cleanupExpiredOTPs(): void {
  const now = Date.now();
  for (const [email, otp] of otpStore.entries()) {
    if (now > otp.expiresAt) {
      otpStore.delete(email);
    }
  }
}

/**
 * Returns OTP configuration metadata
 */
export function getOTPMetadata() {
  return {
    expiryMinutes: OTP_EXPIRY_MINUTES,
    maxVerificationAttempts: MAX_VERIFICATION_ATTEMPTS,
    maxResendAttempts: MAX_RESEND_ATTEMPTS,
    resendCooldownSeconds: RESEND_COOLDOWN_SECONDS,
  };
}