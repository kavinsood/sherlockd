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
3. **Origin Fetch** → If not rate limited, fetch from Render service
4. **Cache Storage** → Store successful responses for future use

## Setup

1. Install dependencies:
   ```bash
   cd worker
   npm install
   ```

2. Set the secret for your Render service URL:
   ```bash
   npx wrangler secret put KITSUNE_API_URL
   ```
   Enter: `https://hostedbackend.com/analyze`
   
   **Note**: You can also configure this URL in your frontend's `.env` file as `VITE_RENDER_API_URL` if you want to make it configurable.

3. Deploy the Worker:
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

The Worker will be deployed to Cloudflare's edge network and will be available at your assigned subdomain.

### Getting Your Worker URL

After deployment, you'll see output similar to:
```
✅ Deployment successful!
🎉 Your Worker is now live on Cloudflare's edge network
```

The Worker URL will be in the format: `https://kitsune-worker.your-subdomain.workers.dev`

You can also find your Worker URL by:
1. Going to the [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigating to Workers & Pages
3. Finding your `kitsune-worker` in the list
4. The URL will be displayed in the worker details

**Important**: Copy this URL and add it to your frontend's `.env` file as `VITE_WORKER_URL`. 