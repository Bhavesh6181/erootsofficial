const env = (import.meta as any).env || {};

export const canUseDemoFallbacks =
  env.VITE_ENABLE_DEMO_FALLBACKS === 'true' || Boolean(import.meta.env.DEV);

export const isGoogleLoginEnabled = env.VITE_ENABLE_GOOGLE_LOGIN === 'true';

export const enabledPaymentMethods = String(env.VITE_ENABLED_PAYMENT_METHODS || 'COD')
  .split(',')
  .map((method: string) => method.trim().toUpperCase())
  .filter(Boolean);
