<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";

    onMount(() => {
        if (page.error?.message === "Not Found") {
            goto("/", { replaceState: true });
        }
    });
</script>
