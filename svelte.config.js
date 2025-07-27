import "dotenv/config";
import adapter from "@sveltejs/adapter-static";

import { sveltePreprocess } from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    extensions: [".svelte"],
    preprocess: [
        sveltePreprocess()
    ],
    kit: {
        adapter: adapter({
            // default options are shown. On some platforms
            // these options are set automatically — see below
            pages: 'build',
            assets: 'build',
            fallback: '404.html',
            precompress: false,
            strict: true
        }),
        csp: {
            mode: "hash",
            directives: {
                "connect-src": ["*"],
                "default-src": ["none"],

                "font-src": ["self"],
                "style-src": ["self", "unsafe-inline"],
                "img-src": ["*", "data:"],
                "manifest-src": ["self"],
                "worker-src": ["self"],

                "object-src": ["none"],
                "frame-src": [
                    "self",
                    "challenges.cloudflare.com"
                ],

                "script-src": [
                    "self",
                    "wasm-unsafe-eval",
                    "challenges.cloudflare.com",

                    // hash of the theme preloader in app.html
                    "sha256-g67gIjM3G8yMbjbxyc3QUoVsKhdxgcQzCmSKXiZZo6s=",
                ],

                "script-src-attr": [
                    "unsafe-hashes",
                    // hash of inline img event call
                    // see: https://github.com/sveltejs/svelte/issues/14014
                    "sha256-7dQwUgLau1NFCCGjfn9FsYptB6ZtWxJin6VohGIu20I=",
                    // hash for Turnstile inline event handlers
                    "sha256-+6WnXIl4mbFTCARd8NnhCOU6oIm9k/0b+0bQqYf6V5Q="
                ],

                "frame-ancestors": ["none"]
            }
        },
        env: {
            publicPrefix: 'WEB_'
        },
        version: {
            pollInterval: 60000
        },
        paths: {
            relative: false
        },
        alias: {
            $components: 'src/components',
            $i18n: 'i18n',
        }
    }
};

export default config;
