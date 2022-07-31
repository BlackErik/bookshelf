<template>
  <footer>
        <div>
            <socialMedia/>
        </div>
    </footer>
</template>

<script>
import socialMedia from "../components/Social-media-section.vue"
export default {
    components: {
        socialMedia
    }
}
</script>

<style lang="css" scoped >

footer {
    grid-column: 1/-1;
    grid-row: 4/5;
    display:flex;
    color:  rgb(240, 240, 240);
    font-size: .70em;
    font-style: italic;
    text-align: center;
    padding: 1em;  
    justify-content: space-evenly;
    align-items: center;
    margin-top: 5rem;
}

footer a {
    color:  rgb(240, 240, 240);
}
</style>