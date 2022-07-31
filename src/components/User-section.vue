<template>
  <div id="wrapper">
    <router-link v-if="state.currentUser.length === 0" to="/login"
      ><a>Sign In</a></router-link
    >
    <w-flex v-else align-center class="pr5">
      <w-button icon="mdi mdi-account-circle" xl class="account-button">
      </w-button>
    </w-flex>
    <w-menu
      hide-on-menu-click
      v-show="state.currentUser.length > 0"
      activator=".account-button"
      arrow
    >
      <p class="pr2">{{ state.currentUser }}</p>
      <w-button @click="logOut()">Sign Out</w-button>
    </w-menu>
  </div>
</template>

<script>
import User from "../models/user";

export default {
  setup() {
    const { state, getSession } = User();
    return { state, getSession };
  },
  data() {
    return {};
  },
  methods: {
    async logOut() {
      try {
        let response = await fetch("http://localhost:3000/logout", {
          credentials: "include",
        });
        if (response.status == 200) {
          this.state.currentUser = "";
        }
        this.getSession();
      } catch (err) {
        console.log("some error", err);
      }
    },
  },

  async mounted() {
    await this.getSession();
  },
};
</script>

<style scoped>
a {
  cursor: pointer;
  font-size: large;
  color: rgb(201, 201, 201);
  text-decoration: none;
  text-align: center;
}

p {
  text-align: center;
}
</style>
