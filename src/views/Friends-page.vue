<template>
  <div id="wrapper">
    <w-tabs
      class="mt12"
      v-model="activeTabNum"
      color="secondary"
      :items="tabs"
      center
    ></w-tabs>
    <div v-if="activeTabNum === 0">
      <h3 class="mr3 ml3 mb3">
        Reach out young scholar. Your friends await!
      </h3>
      <div v-for="(friend, index) in friends" :key="index">
        <w-flex justify-center align-center>
          <router-link
            id="name"
            v-if="friend.value == 3"
            :to="{
              name: 'FriendsBookshelf',
              params: { name: friend.name, id: friend.id },
            }"
          >
            <w-button class="mt2" xl>{{ friend.name }}</w-button>
          </router-link>
        </w-flex>
      </div>
    </div>
    <div v-if="activeTabNum === 1">
      <h3 class="mr3 ml3 mb3">
        Don't worry we built it so they will come.
      </h3>
      <div v-for="(friend, index) in friends" :key="index">
        <h2 class="mt8 mb2 secondary" color="" v-if="friend.value == 1">
          <w-card bg-color="secondary" color="primary">{{
            friend.name
          }}</w-card>
        </h2>
        <w-button
          class="mr4"
          v-if="friend.value == 1"
          @click="acceptFriendRequest(friend.id)"
        >
          Add &nbsp;
          <w-icon>mdi mdi-account-plus</w-icon>
        </w-button>
        <w-button
          v-if="friend.value == 1"
          @click="denyFriendRequest(friend.id)"
        >
          Deny &nbsp;
          <w-icon>mdi mdi-account-cancel</w-icon>
        </w-button>
      </div>
    </div>
    <div v-if="activeTabNum === 2">
      <h3 class="mr3 ml3 mb3">Waiting on them...</h3>
      <div v-for="(friend, index) in friends" :key="index">
        <h2 class="mb1">
          <w-card
            bg-color="secondary"
            color="primary"
            v-if="friend.value == 2"
            >{{ friend.name }}</w-card
          >
        </h2>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  setup() {},

  data() {
    return {
      activeTabNum: 0,
      friends: [],
      tabs: [
        { title: "Friends Bookshelf" },
        { title: "Received Friend Requests" },
        { title: "Sent Friend Requests" },
      ],
    };
  },
  methods: {
    async getFriends() {
      let response = await fetch("http://localhost:3000/friends", {
        credentials: "include",
      });
      let data = await response.json();
      this.friends = data;
    },

    async acceptFriendRequest(id) {
      await fetch(`http://localhost:3000/friends/accept/${id}`, {
        method: "PATCH",
        credentials: "include",
      });
      this.getFriends();
    },

    async denyFriendRequest(id) {
      await fetch(`http://localhost:3000/friends/deny/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      this.getFriends();
    },
  },
  computed: {
    friendsExist: function () {
      let aFriendExists = false;
      for (const friend in this.friends) {
        if (this.friends[friend].value == 3) {
          aFriendExists = true;
          return aFriendExists;
        }
      }
      return aFriendExists;
    },

    receivedsExist: function () {
      let receivedFriend = false;
      for (const friend in this.friends) {
        if (this.friends[friend].value == 1) {
          receivedFriend = true;
          return receivedFriend;
        }
      }
      return receivedFriend;
    },

    sentsExist: function () {
      let sentFriend = false;
      for (const friend in this.friends) {
        if (this.friends[friend].value == 2) {
          sentFriend = true;
          return sentFriend;
        }
      }
      return sentFriend;
    },
  },

  created() {
    this.getFriends();
  },
};
</script>
<style scoped>
@import "../book-data/style.css";
#wrapper {
  grid-column: 1/-1;
  grid-row: 2/3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  color: rgb(201, 201, 201);
}

h2 {
  text-align: center;
}

h3 {
  color: rgb(201, 201, 201);
}

#name {
  color: white;
  font-size: 1.5rem;
}
</style>
