export const API_CONFIG = {
  // Development
  DEV_API_URL: 'http://localhost:3000',
  
  // Production
  PROD_API_URL: 'https://api.yourdeliveryapp.com',
  
  // Use this
  API_URL: __DEV__ 
    ? 'http://localhost:3000'  // When testing
    : 'https://api.yourdeliDveryapp.com'  // When live
};