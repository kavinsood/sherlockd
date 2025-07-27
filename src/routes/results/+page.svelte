<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";
    import type { AnalysisResult } from "$lib/types/api";
    import Skeleton from "$components/misc/Skeleton.svelte";
    import IconArrowLeft from "@tabler/icons-svelte/IconArrowLeft.svelte";
    import { config } from "$lib/config";

    let result: AnalysisResult | null = $state(null);
    let isLoading = $state(true);
    let error = $state<string | null>(null);

    // Get URL from query params
    let targetUrl = $derived(browser ? ($page.url.searchParams.get("url") || "") : "");

    $effect(() => {
        if (targetUrl && browser) {
            analyzeUrl(targetUrl);
        }
    });

    const analyzeUrl = async (url: string) => {
        isLoading = true;
        error = null;
        
        try {
            const response = await fetch(config.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Check if this is a special error response from the worker
                if (data.error && data.message) {
                    error = data.message;
                } else {
                    result = data;
                }
            } else {
                error = `Analysis failed: ${response.status} ${response.statusText}`;
            }
        } catch (err) {
            error = 'Failed to analyze URL. Please try again.';
            console.error('Analysis error:', err);
        } finally {
            isLoading = false;
        }
    };

    const goBack = () => {
        goto("/");
    };

    const formatUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch {
            return url;
        }
    };
</script>

<svelte:head>
    <title>Analysis Results - sherlock'd</title>
    <meta property="og:title" content="Analysis Results - sherlock'd" />
</svelte:head>

<div id="results-container" class="center-column-container">
    <!-- Header with back button -->
    <header id="results-header">
        <button class="button elevated back-button" onclick={goBack}>
            <IconArrowLeft />
            <span>Back</span>
        </button>
        
        {#if targetUrl}
            <div id="analyzed-url">
                <h2>Analyzing {formatUrl(targetUrl)}</h2>
            </div>
        {/if}
    </header>

    <!-- Main content -->
    <main id="results-content">
        {#if isLoading}
            <!-- Skeleton loading state -->
            <div id="skeleton-container">
                <Skeleton width="200px" height="24px" />
                <div class="skeleton-section">
                    <Skeleton width="150px" height="20px" />
                    <div class="skeleton-items">
                        <Skeleton width="100px" height="32px" />
                        <Skeleton width="120px" height="32px" />
                        <Skeleton width="80px" height="32px" />
                    </div>
                </div>
                <div class="skeleton-section">
                    <Skeleton width="180px" height="20px" />
                    <div class="skeleton-items">
                        <Skeleton width="110px" height="32px" />
                        <Skeleton width="90px" height="32px" />
                    </div>
                </div>
                <div class="skeleton-section">
                    <Skeleton width="160px" height="20px" />
                    <div class="skeleton-items">
                        <Skeleton width="95px" height="32px" />
                        <Skeleton width="105px" height="32px" />
                        <Skeleton width="85px" height="32px" />
                    </div>
                </div>
            </div>
        {:else if error}
            <!-- Error state -->
            <div id="error-container">
                <img src="/error.avif" alt="Error" height="152" />
                <h3>Oops! Ran into an error</h3>
                <button class="button elevated" onclick={() => analyzeUrl(targetUrl)}>
                    Try Again
                </button>
            </div>
        {:else if result}
            <!-- Results state -->
            <div id="results-data">
                <!-- All Technologies -->
                <section class="result-section">
                    <h3>Technologies Found</h3>
                    <div class="technology-grid">
                        {#each result.technologies as technology}
                            <span class="technology-tag">{technology}</span>
                        {/each}
                    </div>
                </section>

                <!-- Categories -->
                {#each result.categories as category}
                    <section class="result-section">
                        <h3>{category.category}</h3>
                        <div class="technology-grid">
                            {#each category.technologies as technology}
                                <span class="technology-tag">{technology}</span>
                            {/each}
                        </div>
                    </section>
                {/each}
            </div>
        {/if}
    </main>
</div>

<style>
    #results-container {
        padding: var(--padding);
        min-height: 100vh;
        gap: 20px;
    }

    #results-header {
        display: flex;
        align-items: center;
        gap: 15px;
        width: 100%;
        max-width: 800px;
    }

    .back-button {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
    }

    .back-button :global(svg) {
        width: 16px;
        height: 16px;
    }

    #analyzed-url h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
    }

    #results-content {
        width: 100%;
        max-width: 800px;
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    #skeleton-container {
        display: flex;
        flex-direction: column;
        gap: 25px;
    }

    .skeleton-section {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .skeleton-items {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    #error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 15px;
        text-align: center;
        min-height: 400px;
    }

    #error-container h3 {
        margin: 0;
        color: var(--secondary);
        font-size: 18px;
        font-weight: 500;
    }

    #results-data {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    .result-section {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .result-section h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: var(--secondary);
        border-bottom: 1px solid var(--content-border);
        padding-bottom: 8px;
    }

    .technology-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .technology-tag {
        background: var(--button-elevated);
        color: var(--secondary);
        padding: 6px 12px;
        border-radius: var(--border-radius);
        font-size: 13px;
        font-weight: 500;
        border: 1px solid var(--content-border);
    }

    @media screen and (max-width: 535px) {
        #results-container {
            padding-top: calc(var(--padding) / 2);
        }

        #results-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
        }

        .technology-grid {
            gap: 6px;
        }

        .technology-tag {
            font-size: 12px;
            padding: 5px 10px;
        }
    }
</style> 