# sherlockd web
the sherlockd frontend is a static web app built with
[sveltekit](https://kit.svelte.dev/) + [vite](https://vitejs.dev/).

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

After deploying the worker, you need to configure the URLs in your frontend:

1. Create a `.env` file in the root directory
2. Add your configuration:
   ```
   # Worker URL - replace with your actual deployed worker URL
   VITE_WORKER_URL=https://kitsune-worker.your-subdomain.workers.dev
   
   # Render API URL - the backend service URL (optional, has default)
   VITE_RENDER_API_URL=https://kitsune-4d1i.onrender.com/analyze
   ```
   Replace `your-subdomain` with your actual Cloudflare subdomain.

3. Restart your development server for the changes to take effect.

## license
sherlockd web code is licensed under [CC-BY-NC-SA-4.0](LICENSE).

this license allows you to:
- copy and redistribute the code in any medium or format, and
- remix, transform, use and build upon the code

as long as you:
- give appropriate credit to the original repo,
- provide a link to the license and indicate if changes to the code were made,
- release the code under the **same license**, and
- **don't use the code for any commercial purposes**.

sherlockd branding, mascots, and other related assets included in the repo are ***copyrighted*** and not covered by the license. you ***cannot*** use them under same terms.

you are allowed to host an ***unmodified*** instance of sherlockd with branding for **non-commercial purposes**, but this ***does not*** give you permission to use the branding anywhere else, or make derivatives of it in any way.

when making an alternative version of the project, please replace or remove all branding (including the name).

## open source acknowledgments
### svelte + sveltekit
the sherlockd frontend is built using [svelte](https://svelte.dev) and [sveltekit](https://svelte.dev/docs/kit/introduction), a really efficient and badass framework, we love it a lot.

### fonts, icons and assets
the sherlockd frontend uses several different fonts and icon sets.
- [Tabler Icons](https://tabler.io/icons), released under the [MIT](https://github.com/tabler/tabler-icons?tab=MIT-1-ov-file) license.
- [Fluent Emoji by Microsoft](https://github.com/microsoft/fluentui-emoji), released under the [MIT](https://github.com/microsoft/fluentui-emoji/blob/main/LICENSE) license.
- [Noto Sans Mono](https://fonts.google.com/noto/specimen/Noto+Sans+Mono/) used for the download button, is licensed under the [OFL](https://fonts.google.com/noto/specimen/Noto+Sans+Mono/about) license.
- [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono/) used for all other text, is licensed under the [OFL](https://fonts.google.com/specimen/IBM+Plex+Mono/license) license.
- and the [Redaction](https://redaction.us/) font, which is licensed under the [OFL](https://github.com/fontsource/font-files/blob/main/fonts/other/redaction-10/LICENSE) license (as well as LGPL-2.1).
- many update banners were taken from [tenor.com](https://tenor.com/).

### other packages
- [mdsvex](https://github.com/pngwn/MDsveX) to convert the changelogs into svelte components.
- [compare-versions](https://github.com/omichelsen/compare-versions) for sorting the changelogs.
- [svelte-sitemap](https://github.com/bartholomej/svelte-sitemap) for generating a sitemap for the frontend.
- [sveltekit-i18n](https://github.com/sveltekit-i18n/lib) for displaying sherlockd in many different languages.
- [vite](https://github.com/vitejs/vite) for building the frontend.

...and many other packages that these packages rely on.
