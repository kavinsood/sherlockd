import type { Load } from '@sveltejs/kit';

// Disable prerendering for this page since it depends on dynamic URL parameters
export const prerender = false;

export const load: Load = async ({ url }) => {
    const targetUrl = url.searchParams.get('url');
    if (!targetUrl) {
        return { error: 'No URL provided.' };
    }
    
    // Return the URL to be processed on the client side
    return { targetUrl };
};