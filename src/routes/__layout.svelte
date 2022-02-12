<script>
    import 'bootswatch/dist/united/bootstrap.min.css'
    import NavBar from '../components/NavBar.svelte'
</script>

<header>
    <NavBar/>
</header>

<main class="container mt-2">
    <slot/>
</main>

<style>
    main {
        height: 100vh;
    }
</style>
