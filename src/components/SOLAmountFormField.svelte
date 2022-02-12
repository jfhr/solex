<script>
    import { onMount } from 'svelte'

    export let name
    export let value = 0
    export let exchange
    export let readonly = false
    const formatter = new Intl.NumberFormat('de', {
        currency: 'EUR',
        style: 'currency',
    })
    let eur = formatter.format(0)

    function updateEur () {
        if (exchange) {
            eur = formatter.format(value * exchange)
        } else {
            eur = '???'
        }
    }

    function onInput () {
        updateEur()
        localStorage.setItem(name, value)
    }

    onMount(() => {
        value = localStorage.getItem(name)
        updateEur()
    })
</script>

<div class="mb-3 d-flex justify-content-start align-items-end">
    <div>
        <label class="form-label" for={name}>{name}</label>
        <input bind:value class="form-control" id={name} min="0" {name} on:input={onInput} required step="any"
               {readonly} type="number">
    </div>
    <div class="ms-2">
        <div class="form-label"></div>
        <div class="form-control">
            {#if exchange}
                {eur}
            {:else}
                exchange rate unavailable
            {/if}
        </div>
    </div>
</div>
