export interface Env {
	// This binding provides access to the Rate Limiter defined in wrangler.toml
	RATE_LIMITER: RateLimiter;

	// Service binding to the kitsune-wasm Worker. Preferred when present:
	// Workers can't reach other Workers on the same account via workers.dev.
	KITSUNE?: Fetcher;

	// URL of the Kitsune API, used when the KITSUNE binding is absent
	// (e.g. local development against a standalone server).
	KITSUNE_API_URL: string;

	// Environment variable to distinguish between development and production
	ENVIRONMENT: string;

	// Static assets binding
	ASSETS: Fetcher;
}

/**
 * Version of the cached results, part of every cache key. Bump it when a
 * kitsune release changes what it detects, so stale results aren't served
 * for the month they're cached.
 */
const CACHE_VERSION = '2';

/**
 * Normalizes a URL to improve cache hit rates by:
 * - Ensuring HTTPS protocol (preferred over HTTP)
 * - Removing www. prefix
 * - Stripping trailing slash
 * - Converting to lowercase
 */
function normalizeUrl(url: URL): string {
	// Create a new URL object to avoid mutating the original
	const normalized = new URL(url.toString());
	
	// Force HTTPS protocol (preferred over HTTP for consistency)
	if (normalized.protocol === 'http:') {
		normalized.protocol = 'https:';
	}
	
	// Remove www. prefix if present
	if (normalized.hostname.startsWith('www.')) {
		normalized.hostname = normalized.hostname.slice(4);
	}
	
	// Strip trailing slash from pathname (but preserve root path)
	if (normalized.pathname.length > 1 && normalized.pathname.endsWith('/')) {
		normalized.pathname = normalized.pathname.slice(0, -1);
	}
	
	// Convert to lowercase for consistency
	normalized.hostname = normalized.hostname.toLowerCase();
	
	return normalized.toString();
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// --- API Routes ---
		if (url.pathname.startsWith('/analyze')) {
			// --- 1. Basic Request Validation (Fail Fast) ---
			if (request.method !== 'POST') {
				return new Response('Method Not Allowed', { status: 405 });
			}
			if (request.headers.get('content-type') !== 'application/json') {
				return new Response('Unsupported Media Type: Expected application/json', { status: 415 });
			}

			// --- 2. Extract and Validate Target URL from Payload ---
			let targetUrl: URL;
			try {
				const body: { url?: string } = await request.json();
				if (!body.url) {
					return new Response('Missing "url" in request body', { status: 400 });
				}
				targetUrl = new URL(body.url); // This also validates the URL format.
			} catch (error) {
				return new Response('Invalid JSON or URL format', { status: 400 });
			}

			// --- 3. Cache Check (Primary Performance Path) ---
			// The cache is the first line of defense.
			const cache = caches.default;
			
			// Normalize the URL for better cache hit rates
			const normalizedUrl = normalizeUrl(targetUrl);
			const cacheKeyUrl = new URL(normalizedUrl);
			cacheKeyUrl.searchParams.set('__sherlockd_cache', CACHE_VERSION);
			const cacheKey = new Request(cacheKeyUrl.toString(), { method: 'GET' });
			const cachedResponse = await cache.match(cacheKey);

			if (cachedResponse) {
				console.log(`Cache HIT for: ${normalizedUrl} (original: ${targetUrl.toString()})`);
				return cachedResponse;
			}
			console.log(`Cache MISS for: ${normalizedUrl} (original: ${targetUrl.toString()})`);

			// --- 4. Rate Limiting (Only on Cache Miss) ---
			// Use the target's hostname as the key. This enforces a limit per domain analyzed.
			const { success } = await env.RATE_LIMITER.limit({ key: targetUrl.hostname });
			if (!success) {
				return new Response(`Rate limit exceeded for domain: ${targetUrl.hostname}`, { status: 429 });
			}

			// --- 5. Fetch from Origin (the kitsune-wasm Worker) ---
			// If we've gotten this far, we are clear to hit the backend.
			console.log(`Fetching from origin for: ${targetUrl.toString()}`);
			
			let apiResponse: Response;
			try {
				const init: RequestInit = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ url: targetUrl.toString() }),
				};
				// The binding ignores the URL's host; only the path matters.
				apiResponse = env.KITSUNE
					? await env.KITSUNE.fetch('https://kitsune/analyze', init)
					: await fetch(env.KITSUNE_API_URL, init);

				// If the origin fetch failed, just pass its error through.
				if (!apiResponse.ok) {
					return apiResponse;
				}
			} catch (error) {
				// Check if we're in development environment
				const isDevelopment = env.ENVIRONMENT === 'development';
				
				if (isDevelopment) {
					// In development, return a generic error when backend is not available
					console.log('Backend not available in development');
					return new Response(JSON.stringify({ 
						error: true, 
						message: "Backend service not available in development" 
					}), {
						status: 200, // Use 200 so frontend can handle it gracefully
						headers: { 'Content-Type': 'application/json' }
					});
				} else {
					// In production, return a special error response that frontend can handle gracefully
					console.error('Backend fetch failed in production:', error);
					return new Response(JSON.stringify({ 
						error: true, 
						message: "Oops! Ran into an error" 
					}), {
						status: 200, // Use 200 so frontend can handle it gracefully
						headers: { 'Content-Type': 'application/json' }
					});
				}
			}

			// --- 6. Cache the Successful Response ---
			// Error payloads (e.g. the site blocked the scanner) come back as 200s
			// so the frontend can show their message; don't cache those.
			const payload = await apiResponse.text();
			try {
				if (JSON.parse(payload).error) {
					return new Response(payload, apiResponse);
				}
			} catch {
				// Not JSON; cache as-is.
			}

			// Create a new response to add caching headers.
			const responseToCache = new Response(payload, apiResponse);
			responseToCache.headers.set('Cache-Control', 'public, max-age=2628000'); // Cache for ~1 month

			// Use waitUntil to avoid blocking the response to the user on the cache write.
			ctx.waitUntil(cache.put(cacheKey, responseToCache.clone()));

			return responseToCache;
		}

		// --- Static Assets ---
		// Serve static assets from the SvelteKit build
		if (env.ASSETS) {
			return env.ASSETS.fetch(request);
		}
		
		// For local development, return a simple response
		return new Response('Worker is running. Use /analyze endpoint for API calls.', {
			status: 200,
			headers: { 'Content-Type': 'text/plain' }
		});
	},
}; 