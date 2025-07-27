// Configuration for the application
export const config = {
    // API endpoint - for development, use local worker; for production, use relative path
    apiUrl: import.meta.env.DEV ? 'http://localhost:8787/analyze' : '/analyze',
    
    // Render API URL - the backend service URL
    // You can set this via environment variable VITE_RENDER_API_URL
    renderApiUrl: import.meta.env.VITE_RENDER_API_URL || 'https://hostedbackend.com/analyze',
    
    // Other configuration options can be added here
    turnstileEnabled: true,
}; 