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
# 1. In the kitsune repo: deploy the backend Worker
cd cmd/kitsune-worker && npm install && npx wrangler deploy

# 2. Here: build the frontend and deploy sherlockd
pnpm install
pnpm run deploy
```

For detailed setup instructions, see [worker/README.md](worker/README.md).

### Environment Configuration

The project is deployed as a single Cloudflare Worker that serves both the SvelteKit frontend and the API, at https://sherlockd.kavinsood.com.

`/analyze` is served by the [kitsune](https://github.com/kavinsood/kitsune) `kitsune-wasm` Worker (`cmd/kitsune-worker`), reached through the `KITSUNE` service binding in `wrangler.toml`. Deploy that Worker first.

Without the binding, the Worker falls back to `KITSUNE_API_URL`, e.g. a local kitsune server:

```
# .env
KITSUNE_API_URL=http://localhost:8080/analyze
```

### Deployment

To deploy to Cloudflare Workers:

```bash
pnpm run deploy
```

This will:
1. Build the SvelteKit frontend to the `build/` directory
2. Deploy both the frontend and API as a single Worker with static assets
