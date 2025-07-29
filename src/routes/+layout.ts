export const prerender = true;
export const ssr = true;

import type { Load } from '@sveltejs/kit';

export const load: Load = async () => {
    return {};
}
