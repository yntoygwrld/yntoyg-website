import { Resend } from 'resend';

// Initialize Resend client - handle missing API key gracefully
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;
