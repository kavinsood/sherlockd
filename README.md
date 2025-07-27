# sherlockd web
the sherlockd frontend is a static web app built with [sveltekit](https://kit.svelte.dev/) + [vite](https://vitejs.dev/).

## configuring
- to run the dev environment, run `pnpm run dev`.
- to make the release build of the frontend, run `pnpm run build`.

## Cloudflare Worker (Kitsune Proxy)

This project includes a Cloudflare Worker that acts as a caching proxy with rate limiting for the Kitsune API. The Worker is located in the `worker/` directory.

### Features
- **Caching**: Responses cached for ~1 month to minimize origin traffic
- **Rate Limiting**: Per-domain rate limiting (10 requests per 60 seconds)
- **Performance**: Cache-first approach for optimal response times

### Quick Setup
```bash
cd worker
npm install
npx wrangler secret put KITSUNE_API_URL
# Enter: https://hostedbackend.com/analyze
npm run deploy
```

For detailed setup instructions, see [worker/README.md](worker/README.md).

### Environment Configuration

The project is deployed as a single Cloudflare Worker that serves both the SvelteKit frontend and the API. You need to configure the backend API URL:

1. Create a `.env` file in the root directory
2. Add your configuration:
   ```
   # Backend API URL - required for the worker
   KITSUNE_API_URL=https://hostedbackend.com/analyze
   
   # Frontend API URL - optional, has default
   VITE_RENDER_API_URL=https://hostedbackend.com/analyze
   ```

3. Restart your development server for the changes to take effect.

### Deployment

To deploy to Cloudflare Workers:

```bash
pnpm run deploy
```

This will:
1. Build the SvelteKit frontend to the `build/` directory
2. Deploy both the frontend and API as a single Worker with static assets
