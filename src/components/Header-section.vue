<template>
  <header>
    <Nav/>
    <h1 class="pt5"><router-link to="/">Bookshelf</router-link></h1>
    <h2><Acount id="acount" /></h2>
  </header>
</template>

<script>
import Acount from "@/components/User-section.vue";
import Nav from '@/components/Nav-section.vue'
export default {
  components: {
    Nav,
    Acount
  }
}
</script>

<style lang="css" scoped >
* {
  border-radius: 10px;
}

  header {
    grid-column: 1 /-1;
    grid-row: 1/2;
    margin-left: 0px;
    text-align: center;
}
  
a {
    text-decoration: none;
    color: rgb(201, 201, 201);
    font-family:'OCR A', 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    padding: 10px 10px;
    transition: .4s ease-in-out;
}

#acount {
  position: absolute;
  right: 20px;
  top: 26px;
}

</style>