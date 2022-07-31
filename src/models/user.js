import { ref } from "vue";

const User = () => {
  const state = ref({
    currentUser: "",
  });

  const stateSec = ref({
    currentUser: "",
  });

  const getSession = async function () {
    let response = await fetch("http://localhost:3000/session", {
      credentials: "include",
    });
    if (response.status == 200) {
      let data = await response.json();
      state.value.currentUser = data.username;
      stateSec.value.currentUser = data.username;
      this.$router.push({ path: "/", replace: true });
    } else if (response.status == 401) {
      state.value.currentUser = "";
      stateSec.value.currentUser = "";
      this.$router.push({ path: "/login", replace: true });
    } else {
      state.value.currentUser = "";
      stateSec.value.currentUser = "";
    }
  };

  return {
    getSession,
    state,
    stateSec,
  };
};

export default User;
