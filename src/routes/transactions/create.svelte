<script context="module">
    import { loadExchangeRate } from '$lib/loadExchangeRate'

    export async function load () {
        const exchange = await loadExchangeRate()
        return { status: 200, props: { exchange } }
    }
</script>

<script>
    import SOLAddressFormField from '../../components/SOLAddressFormField.svelte'
    import SOLAmountFormField from '../../components/SOLAmountFormField.svelte'
    import { onMount, onDestroy } from 'svelte'
    import TextFormField from '../../components/TextFormField.svelte'

    export let exchange

    let exchangeInterval

    async function updateExchange () {
        exchange = await loadExchangeRate()
    }

    onMount(() => {
        if (!exchangeInterval) {
            exchangeInterval = setInterval(updateExchange, 60_000)
        }
    })

    onDestroy(() => {
        clearInterval(exchangeInterval)
    })
</script>

<section class="row">
    <h1>create a transaction</h1>
    <form action="/api/transactions" method="post">
        <SOLAmountFormField {exchange} name="amount"/>
        <SOLAddressFormField name="recipient"/>
        <TextFormField name="label"/>
        <TextFormField name="memo"/>
        <TextFormField name="message"/>
        <a class="btn btn-outline-primary" href="." type="reset">back</a>
        <button class="btn btn-primary" type="submit">create</button>
    </form>
</section>
