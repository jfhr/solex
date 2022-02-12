<script context="module">
    export async function load ({ url }) {
        const response = await fetch(`${url.origin}/api/transactions`)
        if (response.ok) {
            const data = await response.json()
            return { props: { transactions: data } }
        }
        return { status: response.status }
    }
</script>

<script>
    import { fly } from 'svelte/transition'

    export let transactions

    async function markAsDeleted(id) {
        const index = transactions.findIndex(tx => tx.id === id)
        transactions = transactions.slice(0, index).concat(transactions.slice(index + 1))
        await fetch(`/api/transactions/${id}`, {
            method: 'delete'
        })
    }
</script>

<section class="row pt-3">
    <div class="d-flex justify-content-between align-items-center">
        <h1>transactions</h1>
        <a class="btn btn-primary" href="transactions/create">create new</a>
    </div>
    <table class="table">
        <thead>
        <tr>
            <th scope="col">#</th>
            <th scope="col">amount</th>
            <th scope="col">to</th>
            <th scope="col">status</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        {#each transactions as tx (tx.id)}
            <tr out:fly|local>
                <th scope="row">
                    <a href={`/transactions/${tx.id}`}>{tx.id}</a>
                </th>
                <th scope="row">{tx.amount}</th>
                <td>{tx.recipient}</td>
                <td>{tx.status}</td>
                <td on:click={() => markAsDeleted(tx.id)}><button class="btn">❌</button></td>
            </tr>
        {/each}
        </tbody>
    </table>
</section>
