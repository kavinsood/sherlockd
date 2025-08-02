<script>
    import Omnibox from "$components/save/Omnibox.svelte";
    import SupportedServices from "$components/save/About.svelte";
</script>

<svelte:head>
    <title>sherlock'd</title>
<meta property="og:title" content="sherlock'd" />
</svelte:head>

<div id="sherlockd-save-container" class="center-column-container">
    <SupportedServices />
    <main
        id="sherlockd-save"
        tabindex="-1"
        data-first-focus
    >
        <img src="/sherlockd.avif" alt="Sherlockd" height="152" />
        <Omnibox />
    </main>
    <div id="terms-note">
        We don't store any information about you.
    </div>
</div>

<style>
    #sherlockd-save-container {
        padding: var(--padding);
        overflow: hidden;
    }

    #sherlockd-save {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        gap: 15px;
    }

    #terms-note {
        bottom: 0;
        color: var(--gray);
        font-size: 12px;
        text-align: center;
        padding-bottom: 6px;
        font-weight: 500;
    }

    @media screen and (max-width: 535px) {
        #sherlockd-save-container {
            padding-top: calc(var(--padding) / 2);
        }

        #terms-note {
            font-size: 11px;
            padding-bottom: 0;
        }
    }

    /* Invert sherlockd.avif image in light mode */
    :global(html.light) #sherlockd-save img[src="/sherlockd.avif"] {
        filter: invert(1);
    }
</style>
