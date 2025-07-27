// Cloudflare Worker environment types
interface RateLimiter {
	limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface ExecutionContext {
	waitUntil(promise: Promise<any>): void;
}

interface CacheStorage {
	default: Cache;
}

declare const caches: CacheStorage; 