<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import SherlockdSticker from "$components/icons/SherlockdSticker.svelte";

    // Simple approach: only show the sticker if there's a significant safe area at the top
    // This respects the OS-provided safe area without device-specific magic numbers
    let shouldShow = false;

    const checkSafeArea = () => {
        const safeAreaTop = getComputedStyle(document.documentElement)
            .getPropertyValue("--safe-area-inset-top")
            .trim();
        
        // Convert to number and check if there's a meaningful safe area
        const topValue = parseFloat(safeAreaTop);
        shouldShow = topValue > 20; // Only show if there's a significant safe area
    };

    // Check on mount and when window resizes
    onMount(() => {
        checkSafeArea();
        window.addEventListener('resize', checkSafeArea);
    });

    onDestroy(() => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', checkSafeArea);
        }
    });
</script>

{#if shouldShow}
    <div id="sherlockd-notch-sticker" aria-hidden="true">
        <SherlockdSticker />
    </div>
{/if}

<style>
    #sherlockd-notch-sticker {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 999;
        /* Use safe area padding instead of hardcoded values */
        padding-top: var(--safe-area-inset-top);
    }

    #sherlockd-notch-sticker :global(svg) {
        width: 100px;
        height: 30px;
    }

    /* Responsive sizing for smaller screens */
    @media screen and (max-width: 350px) {
        #sherlockd-notch-sticker :global(svg) {
            height: 24px;
        }
    }

    @media screen and (max-width: 375px) {
        #sherlockd-notch-sticker :global(svg) {
            height: 26px;
        }
    }

    /* Hide in landscape orientation */
    @media screen and (orientation: landscape) {
        #sherlockd-notch-sticker {
            display: none;
        }
    }
</style>
