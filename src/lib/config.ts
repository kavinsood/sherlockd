// Configuration for the application
export const config = {
    // API endpoint - since we're deploying as a single worker, use relative path
    apiUrl: '/api/analyze',
    
    // Render API URL - the backend service URL
    // You can set this via environment variable VITE_RENDER_API_URL
    renderApiUrl: import.meta.env.VITE_RENDER_API_URL || 'https://kitsune-4d1i.onrender.com/analyze',
    
    // Other configuration options can be added here
    turnstileEnabled: true,
}; 