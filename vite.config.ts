import mime from "mime";
import basicSSL from "@vitejs/plugin-basic-ssl";

import { glob } from "glob";
import { sveltekit } from "@sveltejs/kit/vite";
import { createSitemap } from "svelte-sitemap/src/index";
import { defineConfig, searchForWorkspaceRoot, type PluginOption } from "vite";

import { join, basename } from "node:path";
import { createReadStream } from "node:fs";
import { cp, readdir, mkdir } from "node:fs/promises";



const enableCOEP: PluginOption = {
    name: "isolation",
    configureServer(server) {
        server.middlewares.use((_req, res, next) => {
            res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
            res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
            next();
        })
    }
};

const generateSitemap: PluginOption = {
    name: "generate-sitemap",
    async writeBundle(bundle) {
        if (!process.env.WEB_HOST || !bundle.dir?.endsWith('server')) {
            return;
        }

        await createSitemap(`https://${process.env.WEB_HOST}`, {
            changeFreq: 'monthly',
            outDir: '.svelte-kit/output/prerendered/pages',
            resetTime: true
        });
    }
}

export default defineConfig({
    plugins: [
        basicSSL(),
        sveltekit(),
        enableCOEP,
        generateSitemap
    ],
    build: {
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('/web/i18n') && id.endsWith('.json')) {
                        const lang = id.split('/web/i18n/')?.[1].split('/')?.[0];
                        if (lang) {
                            return `i18n_${lang}`;
                        }
                    }
                }
            }
        }
    },
    server: {
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp"
        },
        fs: {
            allow: [
                searchForWorkspaceRoot(process.cwd())
            ]
        },
        proxy: {}
    },

});
