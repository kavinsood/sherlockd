<script lang="ts">
    import "../app.css";
    import "../fonts/noto-mono-sherlockd.css";

    import "@fontsource/ibm-plex-mono/400.css";
    import "@fontsource/ibm-plex-mono/400-italic.css";
    import "@fontsource/ibm-plex-mono/500.css";

    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { afterNavigate } from "$app/navigation";

    import Turnstile from "$components/misc/Turnstile.svelte";
    import NotchSticker from "$components/misc/NotchSticker.svelte";
    import DialogHolder from "$components/dialog/DialogHolder.svelte";

    let reduceMotion = $state(false);
    let reduceTransparency = $state(false);
    let preloadAssets = $state(false);
    let theme = $state('dark'); // Default for SSR

    if (browser) {
        // Create a media query object
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

        // Set the initial theme based on the query
        theme = mediaQuery.matches ? 'light' : 'dark';

        // Listen for changes
        mediaQuery.addEventListener('change', (e) => {
            theme = e.matches ? 'light' : 'dark';
        });
    }

    afterNavigate(async () => {
        const to_focus: HTMLElement | null =
            document.querySelector("[data-first-focus]");
        to_focus?.focus();
    });

    onMount(() => {
        preloadAssets = true;
    });
</script>

<svelte:head>
    <title>sherlock'd</title>
    <meta name="description" content="sherlockd: The fastest way to see what a website is built with." />
    <meta name="author" content="sherlock'd" />
    <meta name="theme-color" content={theme === 'dark' ? '#000000' : '#ffffff'} />
    
    <!-- Essential OpenGraph tags -->
    <meta property="og:title" content="sherlock'd" />
    <meta property="og:description" content="sherlockd: The fastest way to see what a website is built with." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://sherlockd.run" />
    <meta property="og:site_name" content="sherlock'd" />
    <meta property="og:locale" content="en_US" />
    
    <!-- OpenGraph image -->
    <meta property="og:image" content="https://sherlockd.run/og_image.png" />
    <meta property="og:image:alt" content="sherlockd: The fastest way to see what a website is built with." />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    
    <!-- Twitter Card tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="sherlock'd" />
    <meta name="twitter:description" content="sherlockd: The fastest way to see what a website is built with." />
    <meta name="twitter:image" content="https://sherlockd.run/og_image.png" />
    <meta name="twitter:image:alt" content="sherlockd: The fastest way to see what a website is built with." />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://sherlockd.run" />
</svelte:head>

<div
    style="display: contents"
    lang="en"
>
    {#if preloadAssets}
        <div id="preload" aria-hidden="true">??</div>
    {/if}
    <div
        id="sherlockd"
        class:loaded={browser}
        data-reduce-motion={reduceMotion}
        data-reduce-transparency={reduceTransparency}
    >
        <NotchSticker />
        <DialogHolder />
        <div id="content">
            <Turnstile />
            <slot></slot>
        </div>
    </div>
</div>

<style>
    #sherlockd {
        height: 100%;
        width: 100%;
        display: flex;
        overflow: hidden;
        background-color: var(--primary);
        color: var(--secondary);
        position: fixed;
    }

    #content {
        display: flex;
        background-color: var(--primary);
        width: 100%;
        height: 100%;
    }



    @media screen and (max-width: 535px) {
        #content {
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
        }
    }

    /* preload assets to prevent flickering when they appear on screen */
    #preload {
        width: 0;
        height: 0;
        position: absolute;
        z-index: -10;
        content: url(/sherlockd.avif) url(/error.avif);

        font-family: "Recursive Mono";
        font-size: 0;
        opacity: 0;

        pointer-events: none;
        user-select: none;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }
</style>
