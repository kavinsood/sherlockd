<script lang="ts">
    import { config } from "$lib/config";
    
    export let url: string;
    export let disabled = false;

    let buttonText = ">>";
    let buttonAltText = "Download";

    const handleClick = async () => {
        if (url && !disabled) {
            console.log("Download requested for:", url);
            
            try {
                // Call the API endpoint
                const response = await fetch(config.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url }),
                });
                
                if (response.ok) {
                    const result = await response.json();
                    console.log("Worker response:", result);
                    
                    // If the worker returns a download URL, open it
                    if (result.downloadUrl) {
                        window.open(result.downloadUrl, '_blank');
                    } else {
                        // Fallback to original URL if no download URL provided
                        window.open(url, '_blank');
                    }
                } else {
                    console.error("Worker error:", response.status, response.statusText);
                    // Fallback to original URL on error
                    window.open(url, '_blank');
                }
            } catch (error) {
                console.error("Failed to call worker:", error);
                // Fallback to original URL on error
                window.open(url, '_blank');
            }
        }
    };
</script>

<button
    id="download-button"
    {disabled}
    onclick={handleClick}
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
