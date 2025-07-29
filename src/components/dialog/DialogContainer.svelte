<script lang="ts">
    import { tick } from "svelte";
    import DialogBackdropClose from "$components/dialog/DialogBackdropClose.svelte";

    export let id: string;
    export let dismissable = true;

    let dialogParent: HTMLDialogElement;
    let dialogBody: HTMLDivElement;

    let open = false;
    let closing = false;

    export const close = () => {
        if (dialogParent) {
            closing = true;
            open = false;
            // The actual closing will be handled by onanimationend
        }
    };

    const handleAnimationEnd = () => {
        if (closing && dialogParent) {
            dialogParent.close();
            closing = false; // Reset state
        }
    };

    $: if (dialogParent) {
        dialogParent.showModal();
        tick().then(() => {
            open = true;
        });
    }
</script>

<dialog id="dialog-{id}" bind:this={dialogParent} class:closing class:open>
    <div 
        class="dialog-body" 
        bind:this={dialogBody}
        onanimationend={handleAnimationEnd}
    >
        <slot></slot>
    </div>
    <DialogBackdropClose closeFunc={dismissable ? close : () => {}} />
</dialog>
