<script lang="ts">
    import { goto } from "$app/navigation";
    import { config } from "$lib/config";
    
    export let url: string;
    export let disabled = false;

    let buttonText = ">>";
    let buttonAltText = "Analyze";

    const handleClick = async () => {
        if (url && !disabled) {
            console.log("Analysis requested for:", url);
            
            // Use goto for consistent SPA-style navigation
            goto(`/results?url=${encodeURIComponent(url)}`);
        }
    };
</script>

<button
    id="download-button"
    {disabled}
    on:click={handleClick}
    aria-label={buttonAltText}
>
    <span id="download-state">{buttonText}</span>
</button>

<style>
    #download-button {
        display: flex;
        align-items: center;
        justify-content: center;

        height: 100%;
        min-width: 48px;
        width: 48px;

        border-radius: 0;

        /* visually align the button, +1.5px because of inset box-shadow on parent */
        padding: 0 13.5px 0 12px;

        background: none;
        box-shadow: none;
        transform: none;

        border-left: 1.5px var(--input-border) solid;
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
    }

    #download-button:dir(rtl) {
        border-left: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;

        border-right: 1.5px var(--input-border) solid;
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);

        direction: ltr;
        padding: 0 12px 0 15px;
    }

    #download-state {
        font-size: 24px;
        font-family: "Recursive Mono", "IBM Plex Mono", monospace;
        font-weight: 400;

        text-align: center;
        text-indent: -5px;
        letter-spacing: -5.3px;

        margin-bottom: 2px;
    }

    #download-button:disabled {
        cursor: unset;
        color: var(--gray);
    }

    :global(#input-container.focused) #download-button {
        border-left: 2px var(--secondary) solid;
    }

    :global(#input-container.focused) #download-button:dir(rtl) {
        border-left: 0;
        border-right: 2px var(--secondary) solid;
    }

    @media (hover: hover) {
        #download-button:hover:not(:disabled) {
            background: var(--button-hover-transparent);
        }
    }

    #download-button:active:not(:disabled) {
        background: var(--button-press-transparent);
    }
</style>
