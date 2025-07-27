<script>
    import IconX from "@tabler/icons-svelte/IconX.svelte";

    export let click;
</script>

<button
    id="clear-button"
    class="button"
    onclick={click}
    aria-label="Clear input"
>
    <IconX />
</button>

<style>
    #clear-button {
        padding: 3px;
        border-radius: 100%;
    }

    #clear-button :global(svg) {
        width: 16px;
        height: 16px;
        stroke-width: 2px;
        stroke: var(--secondary);
        will-change: transform;
    }
</style>
