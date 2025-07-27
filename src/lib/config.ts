// Configuration for the application
export const config = {
    // Worker URL - replace with your actual deployed worker URL
    // You can set this via environment variable VITE_WORKER_URL or use the default
    workerUrl: import.meta.env.VITE_WORKER_URL || 'https://kitsune-worker.your-subdomain.workers.dev',
    
    // Render API URL - the backend service URL
    // You can set this via environment variable VITE_RENDER_API_URL
    renderApiUrl: import.meta.env.VITE_RENDER_API_URL || 'https://kitsune-4d1i.onrender.com/analyze',
    
    // Other configuration options can be added here
    turnstileEnabled: true,
}; 