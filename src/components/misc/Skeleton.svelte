<script lang="ts">
    export let width: string = "100%";
    export let height: string = "20px";
    export let borderRadius: string = "var(--border-radius)";
</script>

<div 
    class="skeleton"
    style="width: {width}; height: {height}; border-radius: {borderRadius};"
></div>

<style>
    .skeleton {
        background: var(--skeleton-gradient);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s ease-in-out infinite;
    }

    @keyframes skeleton-loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }
</style>