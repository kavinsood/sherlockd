<script lang="ts">
    import IconPlus from "@tabler/icons-svelte/IconPlus.svelte";
    import PopoverContainer from "$components/misc/PopoverContainer.svelte";

    let expanded = $state(false);

    const popoverAction = async () => {
        expanded = !expanded;
    };
</script>

<div id="supported-services" class:expanded>
    <button
        id="services-button"
        class="button"
        onclick={popoverAction}
        aria-label={expanded ? "Hide about" : "Show about"}
    >
        <div class="expand-icon">
            <IconPlus />
        </div>
        <span class="title">About</span>
    </button>

    <PopoverContainer id="services-popover" {expanded}>
        <div id="about-content" class="subtext">
            I got tired of waiting 30 seconds for Wappalyzer.  Sherlock'd sees everything, instantly. No login, no upsell. Built with Go because speed matters.  Point it at any site and get what they’re hiding. <a href="https://github.com/kavinsood/kitsune" target="_blank" rel="noopener noreferrer">Open source</a> because the internet deserves better tools. Made by <a href="https://kvnsd.co" target="_blank" rel="noopener noreferrer">Kavin</a>
        </div>
    </PopoverContainer>
</div>

<style>
    #supported-services {
        display: flex;
        position: relative;
        max-width: 400px;
        flex-direction: column;
        align-items: center;
        height: 35px;
    }

    #services-button {
        gap: 9px;
        padding: 7px 13px 7px 10px;
        justify-content: flex-start;
        border-radius: 18px;
        display: flex;
        flex-direction: row;
        font-size: 13px;
        font-weight: 500;
        background: none;
        transition:
            background 0.2s,
            box-shadow 0.1s;
    }

    #services-button:not(:active) {
        box-shadow: none;
    }

    .expand-icon {
        height: 22px;
        width: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 18px;
        background: var(--button-elevated);
        padding: 0;
        box-shadow: none;
        transition:
            background 0.2s,
            transform 0.2s;
    }

    #services-button:active {
        background: var(--button-hover-transparent);
    }

    @media (hover: hover) {
        #services-button:hover {
            background: var(--button-hover-transparent);
        }

        #services-button:active {
            background: var(--button-press-transparent);
        }

        #services-button:hover .expand-icon {
            background: var(--button-elevated-hover);
        }
    }

    @media (hover: none) {
        #services-button:active {
            box-shadow: none;
        }
    }

    #services-button:active .expand-icon {
        background: var(--button-elevated-press);
    }

    .expand-icon :global(svg) {
        height: 18px;
        width: 18px;
        stroke-width: 2px;
        color: var(--secondary);
        will-change: transform;
    }

    .expanded .expand-icon {
        transform: rotate(45deg);
    }

    #about-content {
        padding: 0;
        user-select: none;
        -webkit-user-select: none;
        text-align: center;
    }

    .expanded #about-content {
        padding: 0;
        user-select: text;
        -webkit-user-select: text;
        text-align: center;
    }

    @media screen and (max-width: 535px) {
        .expand-icon {
            height: 21px;
            width: 21px;
        }

        .expand-icon :global(svg) {
            height: 16px;
            width: 16px;
        }
    }
</style>
