<script>
    import NavBarLink from './NavBarLink.svelte'

    let expanded = false

    function toggleDropdown () {
        expanded = !expanded
    }
</script>

<nav class="navbar navbar-expand-sm navbar-light bg-light">
    <div class="container">
        <NavBarLink href="/" brand={true}>solex</NavBarLink>
        <button aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"
                class="navbar-toggler"
                on:click={toggleDropdown} type="button">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse" class:collapse={!expanded} id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-sm-0">
                <li class="nav-item">
                    <NavBarLink href="/transactions">transactions</NavBarLink>
                </li>
            </ul>
        </div>
    </div>
</nav>
