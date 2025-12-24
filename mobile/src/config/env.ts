/**
 * Environment configuration
 */

export const ENV = {
  API_URL: process.env.API_URL || 'http://localhost:8000',
  API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '30000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export const isDevelopment = ENV.NODE_ENV === 'development';
export const isProduction = ENV.NODE_ENV === 'production';
