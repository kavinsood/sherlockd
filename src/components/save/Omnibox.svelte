<script lang="ts">
    import { tick } from "svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";

    import ClearButton from "$components/save/buttons/ClearButton.svelte";
    import DownloadButton from "$components/save/buttons/DownloadButton.svelte";

    import OmniboxIcon from "$components/save/OmniboxIcon.svelte";
    import CaptchaTooltip from "$components/save/CaptchaTooltip.svelte";
    import Turnstile from "$components/misc/Turnstile.svelte";
    import { config } from "$lib/config";

    type Optional<T> = T | null;

    let linkInput: Optional<HTMLInputElement>;
    let link = $state("");
    let dialogs = $state([]);
    let turnstileEnabled = $state(true); // Enable Turnstile by default
    let turnstileSolved = $state(false);
    let turnstileToken = $state<string | null>(null);
    let turnstileComponent: Turnstile;
    let turnstileExecuting = $state(false); // Prevent multiple executions

    const validLink = (url: string) => {
        try {
            return /^https?\:/i.test(new URL(url).protocol);
        } catch {}
    };

    let isFocused = $state(false);
    let isDisabled = $state(false);
    let isLoading = $state(false);

    let isHovered = $state(false);

    let isBotCheckOngoing = $derived(false); // Disable loading state for Turnstile

    let linkPrefill = $derived(
        page.url.hash.replace("#", "")
        || (browser ? page.url.searchParams.get("u") : "")
        || ""
    );

    let downloadable = $derived(validLink(link));
    let clearVisible = $derived(link && !isLoading);

    $effect (() => {
        if (linkPrefill) {
            // prefilled link may be uri encoded
            const decodedLink = decodeURIComponent(linkPrefill);

            if (validLink(decodedLink)) {
                link = decodedLink;
            }

            // clear hash and query to prevent bookmarking unwanted links
            if (browser) goto("/", { replaceState: true });
        }
    });

    const pasteClipboard = async () => {
        if (dialogs.length > 0 || isDisabled || isLoading) {
            return;
        }

        try {
            const pastedData = await navigator.clipboard.readText();
            if (!pastedData) return;

            const linkMatch = pastedData.match(/https?\:\/\/[^\s]+/g);

            if (linkMatch) {
                link = linkMatch[0].split('，')[0];
            }
        } catch (error) {
            // Handle clipboard permission denial gracefully
            if (error instanceof Error && error.name === 'NotAllowedError') {
                console.warn('Clipboard permission denied by user');
                // Could show a user-friendly message here if needed
                return;
            }
            console.error('Failed to read clipboard:', error);
        }
    };

    const handleTurnstileSolved = (event: CustomEvent<{ token: string }>) => {
        console.log("Turnstile solved successfully");
        turnstileSolved = true;
        turnstileToken = event.detail.token;
        turnstileExecuting = false;
        console.log("Turnstile solved with token:", event.detail.token);
    };

    const handleTurnstileError = (event: CustomEvent<{ error: string }>) => {
        console.error("Turnstile error:", event.detail.error);
        turnstileSolved = false;
        turnstileToken = null;
        turnstileExecuting = false;
        // Don't auto-reset on error to prevent recursive failures
        // Let the scheduled reset handle it
    };

    const savingHandler = async ({ url }: { url: string }) => {
        if (url && validLink(url) && !isDisabled && !isLoading) {
            console.log("Download requested for:", url);
            
            isLoading = true;
            
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
            } finally {
                isLoading = false;
                
                // Trigger Turnstile verification in background (non-blocking)
                if (turnstileEnabled && !turnstileSolved && !turnstileExecuting) {
                    console.log("Triggering background Turnstile verification...");
                    turnstileExecuting = true;
                    // Small delay to ensure download starts first
                    setTimeout(() => {
                        turnstileComponent?.execute();
                    }, 100);
                }
                
                // Reset Turnstile after action (regardless of verification status)
                setTimeout(() => {
                    if (turnstileComponent) {
                        turnstileComponent.reset();
                        turnstileSolved = false;
                        turnstileToken = null;
                        turnstileExecuting = false;
                    }
                }, 2000); // Reset after 2 seconds
            }
        }
    };

    const handleKeydown = (e: KeyboardEvent) => {
        if (!linkInput || dialogs.length > 0 || isDisabled || isLoading) {
            return;
        }

        if (e.metaKey || e.ctrlKey || e.key === "/") {
            linkInput.focus();
        }

        if (e.key === "Enter" && validLink(link) && isFocused) {
            savingHandler({ url: link });
        }

        if (["Escape", "Clear"].includes(e.key) && isFocused) {
            link = "";
        }

        if (e.target === linkInput) {
            return;
        }

        switch (e.key) {
            case "D":
                pasteClipboard();
                break;
            default:
                break;
        }
    };
</script>

<svelte:window onkeydown={handleKeydown} />

<!--
    if you want to remove the community instance label,
    refer to the license first https://github.com/imputnet/sherlockd/tree/main/web#license
-->

<div id="omnibox">
    {#if turnstileEnabled}
        <CaptchaTooltip
            visible={isBotCheckOngoing && (isHovered || isFocused)}
        />
    {/if}

    <div
        id="input-container"
        class:focused={isFocused}
        class:downloadable
        class:clear-visible={clearVisible}
    >
        <OmniboxIcon loading={isLoading || isBotCheckOngoing} />

        <input
            id="link-area"
            bind:value={link}
            bind:this={linkInput}
            oninput={() => (isFocused = true)}
            onfocus={() => (isFocused = true)}
            onblur={() => (isFocused = false)}
            onmouseover={() => (isHovered = true)}
            onmouseleave={() => (isHovered = false)}
            spellcheck="false"
            autocomplete="off"
            autocapitalize="off"
            maxlength="512"
            placeholder="Paste a link here..."
            aria-label={isBotCheckOngoing
                ? "Link input area (captcha required)"
                : "Link input area"}
            data-form-type="other"
            disabled={isDisabled}
        />

        <ClearButton click={() => (link = "")} />
        <DownloadButton
            url={link}
            bind:disabled={isDisabled}
        />
    </div>

    <!-- Hidden Turnstile component -->
    <Turnstile 
        bind:this={turnstileComponent}
        on:solved={handleTurnstileSolved}
        on:error={handleTurnstileError}
    />
</div>

<style>
    #omnibox {
        display: flex;
        flex-direction: column;
        max-width: 640px;
        width: 100%;
        gap: 6px;
        position: relative;
    }

    #input-container {
        --input-padding: 10px;
        display: flex;
        box-shadow: 0 0 0 1.5px var(--input-border) inset;
        /* webkit can't render the 1.5px box shadow properly,
           so we duplicate the border as outline to fix it visually */
        outline: 1.5px solid var(--input-border);
        outline-offset: -1.5px;
        border-radius: var(--border-radius);
        align-items: center;
        gap: var(--input-padding);
        font-size: 14px;
        flex: 1;
    }

    #input-container:not(.clear-visible) :global(#clear-button) {
        display: none;
    }

    #input-container:not(.downloadable) :global(#download-button) {
        display: none;
    }

    #input-container.clear-visible {
        padding-right: var(--input-padding);
    }

    :global([dir="rtl"]) #input-container.clear-visible {
        padding-right: unset;
        padding-left: var(--input-padding);
    }

    #input-container.downloadable {
        padding-right: 0;
    }

    #input-container.downloadable:dir(rtl) {
        padding-left: 0;
    }

    #input-container.focused {
        box-shadow: none;
        outline: var(--secondary) 2px solid;
        outline-offset: -1px;
    }

    #input-container.focused :global(#input-icons svg) {
        stroke: var(--secondary);
    }

    #input-container.downloadable :global(#input-icons svg) {
        stroke: var(--secondary);
    }

    #link-area {
        display: flex;
        width: 100%;
        margin: 0;
        padding: var(--input-padding) 0;
        padding-left: calc(var(--input-padding) + 28px);
        height: 18px;

        align-items: center;

        border: none;
        outline: none;
        background-color: transparent;
        color: var(--secondary);

        -webkit-tap-highlight-color: transparent;
        flex: 1;

        font-weight: 500;

        /* workaround for safari */
        font-size: inherit;

        /* prevents input from poking outside of rounded corners */
        border-radius: var(--border-radius);
    }

    :global([dir="rtl"]) #link-area {
        padding-left: unset;
        padding-right: calc(var(--input-padding) + 28px);
    }

    #link-area::placeholder {
        color: var(--gray);
        /* fix for firefox */
        opacity: 1;
    }

    /* fix for safari */
    input:disabled {
        opacity: 1;
    }


</style>
