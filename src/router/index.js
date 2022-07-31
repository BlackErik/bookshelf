import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home-page.vue";
import Books from "@/views/Books-page.vue";
import About from "@/views/About-page.vue";
import Search from "@/views/Search-page.vue";
import Login from "@/views/Login-page.vue";
import Register from "@/views/Register-page.vue";
import Scanner from "@/views/Scanner-page.vue";
import Friends from "@/views/Friends-page.vue";
import Users from "@/views/Users-page.vue";
import FriendsBookshelf from "@/views/FriendsBookshelf-page.vue";

const routes = [
  {
    //we are kind of linking everything together here to use esle where.
    path: "/", // Used to link to App.vue.
    name: "Home", // dont know yet.
    component: Home, // links the top imports, linking everything to everything else.
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/books",
    name: "Books",
    component: Books,
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/scanner",
    name: "Scanner",
    component: Scanner,
  },
  {
    path: "/friends",
    name: "Friends",
    component: Friends,
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
  },
  {
    path: "/FriendsBookshelf/:name/:id",
    name: "FriendsBookshelf",
    component: FriendsBookshelf,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
