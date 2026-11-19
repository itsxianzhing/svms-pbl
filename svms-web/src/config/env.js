export const env = {
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
  showDemoAccounts: import.meta.env.VITE_SHOW_DEMO_ACCOUNTS === 'true',
};
