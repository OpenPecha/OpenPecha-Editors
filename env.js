const env = process.env.APP_ENV

if (env === 'production') {
  envApiUrl = `https://${process.env.APP_DOMAIN_PROD}`;
} else if (env === 'staging') {
  envApiUrl = `https://${process.env.APP_DOMAIN_STAG}`;
} else {
  envApiUrl = `http://${process.env.APP_DOMAIN_DEV}`;
}

export const apiUrl = envApiUrl;
export const appName = process.env.APP_NAME;