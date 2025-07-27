<script lang="ts">
    export let id: string;
    export let click = () => {
        alert("no function assigned");
    };
</script>

<button id="button-{id}" class="button" onclick={click}>
    <slot></slot>
</button>
