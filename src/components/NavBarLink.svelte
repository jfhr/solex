<script>
    import { page } from '$app/stores'

    export let href
    export let brand = false
    let current = false

    $: if ($page.url.pathname === href) {
        current = 'page'
    } else {
        current = false
    }
</script>

<a aria-current={current} class:nav-link={!brand} class:navbar-brand={brand} {href}>
    <slot/>
</a>
