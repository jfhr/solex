<script>
    import { onMount } from 'svelte'

    export let name
    export let value = ''

    function onInput () {
        localStorage.setItem(name, value)
    }

    onMount(() => {
        value = localStorage.getItem(name)
    })
</script>


<div class="mb-3">
    <label class="form-label" for={name}>{name}</label>
    <input bind:value class="form-control" id={name} {name} on:input={onInput} required type="text">
</div>
