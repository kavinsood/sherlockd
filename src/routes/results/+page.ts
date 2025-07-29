import type { Load } from '@sveltejs/kit';
import { config } from '$lib/config';

// Disable prerendering for this page since it depends on dynamic URL parameters
export const prerender = false;

export const load: Load = async ({ url, fetch }) => {
    const targetUrl = url.searchParams.get('url');
    if (!targetUrl) {
        return { error: 'No URL provided.' };
    }

    try {
        const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: targetUrl }),
        });

        if (!response.ok) {
            return { error: `Analysis failed: ${response.status} ${response.statusText}` };
        }
        
        const data = await response.json();
        
        // Check if this is a special error response from the worker
        if (data.error && data.message) {
            return { error: data.message, targetUrl };
        }
        
        return { result: data, targetUrl };
    } catch (err) {
        console.error('Analysis error:', err);
        return { error: 'Failed to connect to the analysis service.', targetUrl };
    }
};