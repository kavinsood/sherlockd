export interface Env {
	// This binding provides access to the Rate Limiter defined in wrangler.toml
	RATE_LIMITER: RateLimiter;

	// Environment variable holding the URL of your Render service.
	KITSUNE_API_URL: string;

	// Static assets binding
	ASSETS: Fetcher;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// --- API Routes ---
		if (url.pathname.startsWith('/api/')) {
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
			const cacheKey = new Request(targetUrl.toString(), { method: 'GET' });
			const cachedResponse = await cache.match(cacheKey);

			if (cachedResponse) {
				console.log(`Cache HIT for: ${targetUrl.toString()}`);
				return cachedResponse;
			}
			console.log(`Cache MISS for: ${targetUrl.toString()}`);

			// --- 4. Rate Limiting (Only on Cache Miss) ---
			// Use the target's hostname as the key. This enforces a limit per domain analyzed.
			const { success } = await env.RATE_LIMITER.limit({ key: targetUrl.hostname });
			if (!success) {
				return new Response(`Rate limit exceeded for domain: ${targetUrl.hostname}`, { status: 429 });
			}

			// --- 5. Fetch from Origin (Your Render Service) ---
			// If we've gotten this far, we are clear to hit the backend.
			console.log(`Fetching from origin for: ${targetUrl.toString()}`);
			const apiResponse = await fetch(env.KITSUNE_API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url: targetUrl.toString() }),
			});

			// If the origin fetch failed, just pass its error through.
			if (!apiResponse.ok) {
				return apiResponse;
			}

			// --- 6. Cache the Successful Response ---
			// Create a new response to add caching headers.
			const responseToCache = new Response(apiResponse.body, apiResponse);
			responseToCache.headers.set('Cache-Control', 'public, max-age=2628000'); // Cache for ~1 month

			// Use waitUntil to avoid blocking the response to the user on the cache write.
			ctx.waitUntil(cache.put(cacheKey, responseToCache.clone()));

			return responseToCache;
		}

		// --- Static Assets ---
		// Serve static assets from the SvelteKit build
		return env.ASSETS.fetch(request);
	},
}; 