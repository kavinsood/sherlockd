// Configuration for the application
export const config = {
    // API endpoint - for development, use local worker; for production, use relative path
    apiUrl: import.meta.env.DEV ? 'http://localhost:8787/analyze' : '/analyze',
    
    // Other configuration options can be added here
    turnstileEnabled: true,
}; 