<template>
  <div id="wrapper" class="mt7">
    <w-card content-class="pa0">
      <div class="message-box">
        <w-transition-fade>
          <w-alert
            v-if="state.responseStatus === 201"
            success
            no-border
            class="my0 text-light"
          >
            Trying to sign you in!
          </w-alert>

          <w-alert
            v-else-if="state.responseStatus === 401"
            error
            no-border
            class="my0 text-light"
          >
            Wrong Password</w-alert
          >

          <w-alert
            v-else-if="state.responseStatus === 500"
            error
            no-border
            class="my0 text-light"
          >
            Hmmm... Something went wrong. Try again.
          </w-alert>
        </w-transition-fade>
      </div>

      <w-form class="centered">
        <h1 class="mb12">Log In</h1>

        <w-input
          class="mb3"
          label="Email"
          v-model="email"
          type="text"
          id="email"
          name="email"
          required
          inner-icon-left="mdi mdi-email"
          bg-color="secondary"
          :validators="[validators.required]"
        />

        <w-input
          class="mb3"
          label="Password"
          v-model="password"
          id="password"
          name="password"
          :validators="[validators.required]"
          required
          :type="isPassword ? 'password' : 'text'"
          :inner-icon-right="isPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"
          @click:inner-icon-right="isPassword = !isPassword"
          bg-color="secondary"
          @keyup.enter="loginFunc()"
        />
      </w-form>
    </w-card>
    <w-flex column align-center justify-center class="mt4">
      <w-button @click="loginFunc()" type="submit">Sign In</w-button>
      <br />
      <w-button @click="google()">Google Sign In</w-button>
      <br />
      <p>Don't have an acount?</p>
      <br />
      <w-button @click="this.$router.push({ path: '/register' })"
        >Sign Up</w-button
      >
    </w-flex>
  </div>
</template>

<script>
import Login from "../models/login";
import User from "../models/user";

export default {
  setup() {
    const { state, postSession } = Login();
    const { getSession } = User();
    return { state, postSession, getSession };
  },
  data() {
    return {
      email: "",
      password: "",
      isPassword: true,
      validators: {
        required: (value) => !!value || "This field is required",
      },
    };
  },
  methods: {
    async loginFunc() {
      await this.postSession(this.email, this.password);
      await this.getSession;
    },
    async google() {
      await window.open(
        "http://localhost:3000/auth/google",
        "newwindow",
        "width=500,height=600"
      );
    },
  },
};
</script>

<style scoped>
.mdi-email::before {
  color: #2196f3 !important;
}

#wrapper {
  grid-column: 1/-1;
  grid-row: 2/3;
}

h1 {
  text-align: center;
}

h2 {
  color: white;
  text-align: center;
}

#link {
  display: flex;
  align-content: center;
  justify-content: center;
}

p {
  text-align: center;
  cursor: default;
}

a,
p {
  font-weight: 700;
  color: rgb(201, 201, 201);
  text-decoration: none;
}
</style>
