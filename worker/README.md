# Kitsune Worker

A Cloudflare Worker that acts as a caching proxy with rate limiting for the Kitsune API.

## Features

- **Caching**: Responses are cached for ~1 month to minimize origin traffic
- **Rate Limiting**: Per-domain rate limiting (10 requests per 60 seconds)
- **Error Handling**: Robust error handling with proper HTTP status codes
- **Performance**: Cache-first approach for optimal response times

## Architecture

The Worker follows this flow:
1. **Cache Check** → If cached, return immediately
2. **Rate Limit Check** → Only on cache miss, check rate limits
3. **Origin Fetch** → If not rate limited, call the `kitsune-wasm` Worker through the `KITSUNE` service binding
4. **Cache Storage** → Store successful responses for future use

## Setup

1. Install dependencies:
   ```bash
   cd worker
   npm install
   ```

2. Deploy the `kitsune-wasm` Worker from the kitsune repo (`cmd/kitsune-worker`).
   This Worker reaches it through the `KITSUNE` service binding; without the
   binding it falls back to `KITSUNE_API_URL`.

3. Deploy the Worker (it uses the root `wrangler.toml`):
   ```bash
   npm run deploy
   ```

## Configuration

### Rate Limiting
- **Limit**: 10 requests per 60 seconds per domain
- **Key**: Uses the hostname of the target URL (e.g., `hackerone.com`)
- **Namespace ID**: 1337 (unique identifier for this rate limiter)

### Caching
- **Duration**: ~1 month (2,628,000 seconds)
- **Strategy**: Cache-first with background updates

## API Usage

The Worker accepts POST requests with JSON payload:

```json
{
  "url": "https://example.com"
}
```

### Response Codes
- `200`: Success (cached or fresh)
- `400`: Bad Request (invalid JSON or missing URL)
- `405`: Method Not Allowed (non-POST requests)
- `415`: Unsupported Media Type (non-JSON content)
- `429`: Rate Limit Exceeded
- `5xx`: Origin service errors (passed through)

## Development

```bash
# Start development server
npm run dev

# Type checking
npm run type-check
```

## Deployment

```bash
npm run deploy
```

This deploys the `sherlockd` Worker with the repository's root `wrangler.toml`, which serves the site and this API at sherlockd.kavinsood.com.
