<script context="module">
    import { loadExchangeRate } from '$lib/loadExchangeRate'

    async function loadTransaction (origin, id) {
        const response = await fetch(`${origin}/api/transactions/${id}`)
        if (response.ok) {
            return await response.json()
        }
    }

    async function validateTransaction (origin, id) {
        const response = await fetch(`${origin}/api/transactions/${id}/validate`, {
            method: 'post'
        })
        if (response.ok) {
            return await response.json()
        }
    }

    export async function load ({ url, params }) {
        const [transaction, exchange] = await Promise.all([
            loadTransaction(url.origin, params.id),
            loadExchangeRate(),
        ])
        return { props: { transaction, exchange, origin: url.origin, id: params.id } }
    }
</script>

<script>
    import { onMount, onDestroy } from 'svelte'
    import { slide } from 'svelte/transition'
    import { createQR, encodeURL } from '@solana/pay'
    import { PublicKey } from '@solana/web3.js'
    import BigNumber from 'bignumber.js'
    import Checkmark from '../../components/Checkmark.svelte'
    import CheckmarkAll from '../../components/CheckmarkAll.svelte'
    import SOLAmountFormField from '../../components/SOLAmountFormField.svelte'

    export let transaction
    export let origin
    export let id
    export let exchange

    /** @type { HTMLElement } */
    let qrCodeContainer
    let isQrCodeInitialized = false
    let transactionInterval

    async function updateTransaction () {
        const valid = await validateTransaction(origin, id)
        if (valid) {
            transaction.status = valid.status
            if (valid.signature) {
                transaction.signature = valid.signature
            }
        }
    }

    onMount(() => {
        if (!isQrCodeInitialized) {
            const url = encodeURL({
                recipient: new PublicKey(transaction.recipient),
                amount: new BigNumber(transaction.amount),
                reference: new PublicKey(transaction.reference),
                label: transaction.label,
                memo: transaction.memo,
                message: transaction.message,
            })
            const qrCode = createQR(url)
            qrCode.append(qrCodeContainer)
            isQrCodeInitialized = true
        }
        if (!transactionInterval) {
            transactionInterval = setInterval(updateTransaction, 1_000)
        }
    })

    onDestroy(() => {
        clearInterval(transactionInterval)
    })
</script>

<section class="row pt-3">
    <h1>transaction #{transaction?.id}</h1>
    <div class="d-flex justify-content-center">
        <div bind:this={qrCodeContainer} class="qr-code mb-3">
            {#if transaction?.status === 'verified'}
                <div transition:slide|local class="over-qr-code">
                    <CheckmarkAll fill="var(--bs-success)" width="512" height="512"/>
                </div>
            {:else if transaction?.status === 'confirmed'}
                <div transition:slide|local class="over-qr-code">
                    <Checkmark fill="var(--bs-info)" width="512" height="512"/>
                </div>
            {/if}
        </div>
    </div>
    <div class="card mb-3">
        <div class="card-body">
            to:
            <a href={`https://solscan.io/account/${transaction?.recipient}`} target="_blank">{transaction?.recipient}</a>
        </div>
    </div>
    <div class="card mb-3">
        <div class="card-body">
            <SOLAmountFormField name="amount" value={transaction?.amount} {exchange} readonly/>
        </div>
    </div>
    {#if transaction?.status === 'verified'}
        <div class="alert alert-success" transition:slide|local>
            {#if transaction?.signature}
                <a target="_blank" href={`https://solscan.io/tx/${transaction?.signature}`} class="link">verified</a>
            {:else}
                verified
            {/if}
        </div>
    {:else if transaction?.status === 'confirmed'}
        <div class="alert alert-info" transition:slide|local>
            confirmed
        </div>
    {:else}
        <div class="alert alert-secondary" transition:slide|local>
            created
        </div>
    {/if}
</section>

<style>
    .qr-code {
        width: 512px;
        height: 512px;
        display: grid;
    }

    :global .qr-code > * {
        grid-row: 1;
        grid-column: 1;
    }

    .over-qr-code {
        z-index: 10;
        background-color: rgba(255, 255, 255, 0.95);
    }

    .link {
        color: black;
    }

    /* give the alert the same x-padding as the cards above it */
    .alert {
        padding-right: calc(var(--bs-gutter-x) * .5 + 1rem);
        padding-left: calc(var(--bs-gutter-x) * .5 + 1rem);
    }
</style>
