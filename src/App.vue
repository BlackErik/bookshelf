<template>
  <w-app class="wrapper">
    <Header />
    <router-view />
    <Footer />
  </w-app>
</template>

<script>
import Footer from '@/components/Footer-section.vue'
import Header from '@/components/Header-section.vue'
export default {
  components: {
    Header,
    Footer,
  }
}

</script>

<style>


#app {
    margin: 0;
      background-image: linear-gradient(to bottom right, 
    rgb(14, 14, 27), rgb(39, 37, 58));
    font-family: Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.wrapper {
  display: grid;
  grid-template-columns: 100px 1fr repeat(4, minmax(auto, 280px)) 1fr 100px;
}

@media only screen and (max-width: 1260px) {

}

@media only screen and (max-width: 684px) {

}
</style>