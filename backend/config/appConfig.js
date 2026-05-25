const normalizeEmail = (value = '') => String(value).trim().toLowerCase();

const isGoogleAuthConfigured = () => {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here'
  );
};

const getConfiguredAdminEmail = () => {
  return normalizeEmail(process.env.ADMIN_EMAIL || 'eroots2025@gmail.com');
};

const isConfiguredAdminEmail = (email) => {
  return normalizeEmail(email) === getConfiguredAdminEmail();
};

const getRoleForEmail = (email, fallbackRole = 'user') => {
  return isConfiguredAdminEmail(email) ? 'admin' : fallbackRole;
};

const getClientUrl = () => {
  if (process.env.CLIENT_URL && process.env.CLIENT_URL.trim()) {
    return process.env.CLIENT_URL.trim();
  }

  const configuredOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const preferredOrigin = configuredOrigins.find((origin) => !/localhost|127\.0\.0\.1/i.test(origin))
    || configuredOrigins[0];

  return preferredOrigin || 'http://localhost:5173';
};

module.exports = {
  normalizeEmail,
  isGoogleAuthConfigured,
  getConfiguredAdminEmail,
  isConfiguredAdminEmail,
  getRoleForEmail,
  getClientUrl,
};
