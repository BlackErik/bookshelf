<template>
  <div id="wrapper">
    <w-card content-class="pa0">
      <div class="message-box">
        <w-transition-fade>
          <w-alert
            v-if="state.responseStatus === 201"
            success
            no-border
            class="my0 text-light"
          >
            Setting up your accout!
          </w-alert>

          <w-alert
            v-else-if="this.passwordOne != this.passwordTwo"
            error
            no-border
            class="my0 text-light">
            Passwords dont match!
          </w-alert>

          <w-alert
            v-else-if="state.responseStatus === 500"
            error
            no-border
            class="my0 text-light"
          >
            That email or username is already taken. try again...
          </w-alert>
        </w-transition-fade>
      </div>

      <w-form class="centered">
        <h1 class="mb12">Registration</h1>
        <w-input
          label="Username"
          v-model="username"
          inner-icon-left="mdi mdi-account"
          class="mb3"
          type="text"
          bg-color="secondary"
          :validators="[validators.required]"
          name="name"
          required
          outline
          shadow
        />

        <w-input
          class="mb3"
          label="Email"
          v-model="email"
          type="text"
          name="email"
          bg-color="secondary"
          :validators="[validators.required]"
          required
          inner-icon-left="mdi mdi-email"
          outline
          shadow
        />

        <w-input
          v-model="passwordOne"
          class="mb3"
          label="Password"
          :validators="[validators.required]"
          name="password"
          :type="isPassword ? 'password' : 'text'"
          :inner-icon-right="isPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"
          @click:inner-icon-right="isPassword = !isPassword"
          bg-color="secondary"
          required
          outline
          shadow
        />

        <w-input
          v-model="passwordTwo"
          class="mb3"
          label="Confirm Password"
          :validators="[validators.required]"
          name="password"
          :type="isPassword ? 'password' : 'text'"
          :inner-icon-right="isPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"
          @click:inner-icon-right="isPassword = !isPassword"
          bg-color="secondary"
          required
          outline
          shadow
          @keyup.enter="userRegister()"
        />
      </w-form>
    </w-card>
    <br />
    <w-flex column align-center justify-center class="mt4">
      <w-button @click="userRegister()" type="submit">Register</w-button>
      <br />
      <w-button @click="this.$router.go({ path: '/login' })">Login</w-button>
    </w-flex>
  </div>
</template>

<script>
import Register from "../models/register";
export default {
  setup() {
    const { state, postUser } = Register();
    return { state, postUser };
  },
  data() {
    return {
      username: "",
      email: "",
      isPassword: true,
      passwordOne: '',
      passwordTwo: '',
      validators: {
        required: (value) => !!value || "This field is required",
      },
    };
  },
  methods: {
    userRegister() {
      if (this.passwordOne === this.passwordTwo) {
        this.postUser(this.email, this.username, this.passwordTwo)
      }
    }
  },
};
</script>

<style>
#wrapper {
  grid-column: 1/-1;
  grid-row: 2/3;
}

h1 {
  text-align: center;
}

#link {
  display: flex;
  align-content: center;
  justify-content: center;
}

h1 {
  color: white;
}
.centered {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 5rem;
}
</style>
