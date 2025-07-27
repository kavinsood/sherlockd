<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";
    import { browser } from "$app/environment";
    import { env } from "$env/dynamic/public";

    const dispatch = createEventDispatcher<{
        solved: { token: string };
        error: { error: string };
    }>();

    let turnstileSolved = $state(false);
    let turnstileCreated = $state(false);
    let turnstileWidgetId: string | null = null;
    let turnstileInitialized = $state(false); // Prevent multiple initializations

    onMount(() => {
        if (!browser || !env.WEB_TURNSTILE_SITE_KEY || turnstileInitialized) {
            console.warn("Turnstile: Browser or site key not available, or already initialized");
            return;
        }

        // Wait for Turnstile to load with shorter timeout
        const initTurnstile = () => {
            if (typeof window.turnstile === 'undefined') {
                setTimeout(initTurnstile, 50); // Faster polling
                return;
            }

            try {
                // Render invisible Turnstile widget with optimized settings
                turnstileWidgetId = window.turnstile.render('#turnstile-widget', {
                    sitekey: env.WEB_TURNSTILE_SITE_KEY!,
                    theme: 'light',
                    size: 'invisible',
                    callback: (token: string) => {
                        turnstileSolved = true;
                        dispatch('solved', { token });
                    },
                    'expired-callback': () => {
                        turnstileSolved = false;
                        // Don't auto-reset on expiry for invisible mode
                    },
                    'error-callback': () => {
                        // Only dispatch error if not already solved
                        if (!turnstileSolved) {
                            dispatch('error', { error: 'Turnstile verification failed' });
                        }
                    }
                });
                turnstileCreated = true;
                turnstileInitialized = true;
            } catch (error) {
                console.error('Turnstile initialization error:', error);
                turnstileInitialized = true; // Mark as initialized to prevent retries
                dispatch('error', { error: 'Failed to initialize Turnstile' });
            }
        };

        // Start initialization immediately
        initTurnstile();
    });

    // Function to trigger verification (call this when user submits form)
    export function execute() {
        if (turnstileWidgetId && window.turnstile && !turnstileSolved) {
            try {
                window.turnstile.execute(turnstileWidgetId);
            } catch (error) {
                console.error('Turnstile execute error:', error);
                dispatch('error', { error: 'Failed to execute Turnstile' });
            }
        }
    }

    // Function to reset the widget
    export function reset() {
        if (turnstileWidgetId && window.turnstile) {
            try {
                window.turnstile.reset(turnstileWidgetId);
                turnstileSolved = false;
            } catch (error) {
                console.error('Turnstile reset error:', error);
            }
        }
    }
</script>

<svelte:head>
    <script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
    ></script>
</svelte:head>

<div id="turnstile-container">
    <div id="turnstile-widget"></div>
</div>

<style>
    #turnstile-container {
        position: absolute;
        z-index: -1;
        opacity: 0;
        pointer-events: none;
    }

    #turnstile-widget {
        /* Invisible widget - no visual elements */
        display: none;
    }
</style>
