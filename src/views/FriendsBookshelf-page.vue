<template>
  <div id="wrapper">
    <h1 class="mt12">{{ username }}'s Bookshelf</h1>
    <w-button
      class="mt3"
      xl
      v-show="viewComments === false"
      @click="viewComments = true"
      >See Comments</w-button
    >
    <w-button
      xl
      class="mt3"
      v-show="viewComments === true"
      @click="viewComments = false"
      >See Books</w-button
    >
    <div id="bookCollection" v-show="viewComments === false">
      <div class="book-recommend" v-for="(book, index) in books" :key="index">
        <div
          :value="`${index}`"
          ref="bookBox"
          class="book-box"
          @click="bookClickHandler(index)"
        >
          <img
            ref="bookImage"
            :value="`${index}`"
            class="book-image"
            :src="`${book.image}`"
          />
        </div>
        <div
          :value="`${index}`"
          style="visibility: hidden"
          ref="bookContent"
          class="book-content"
        >
          <div :value="`${index}`" class="text-content">
            <h2>{{ book.title }}</h2>
            <!-- Book Title -->
            <w-rating :model-value="book.rating" ref="rating"></w-rating>
            <!-- Book Series Name -->
            <h4>By: {{ book.authors }}</h4>
            <!-- Author's Name -->
            <w-flex justify-start>
              <w-button
                :value="`${index}`"
                ref="amazon"
                class="Amazon mr3"
                @click="openLink(book.link)"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google <w-icon>mdi mdi-link</w-icon></w-button
              ><!-- Product Link -->
              <w-button @click="postBook(book)">
                Save Book<w-icon>mdi mdi-plus</w-icon>
              </w-button>
            </w-flex>
            <p v-html="book.description" :value="`${index}`"></p>
          </div>
        </div>
      </div>
    </div>
    <div class="" v-show="viewComments === true">
      <w-flex justify-center align-center class="mt12 mb8"
        ><h1>Comments</h1>
        <w-button @click="hover = !hover" class="ml3">Edit</w-button></w-flex
      >
      <w-card id="comments" class="">
        <div v-for="(post, i) in bookshelf.posts" :key="i">
          <w-flex
            class="mb6"
            :class="{
              'reverse-end-post': compareName(bookshelf.posts[i].username),
            }"
            align-center
            row
            wrap
          >
            <w-tag lg color="secondary" bg-color="primary" class="mr4 ml4">{{
              bookshelf.posts[i].username
            }}</w-tag>
            <p class="mr1 ml1" color="secondary">
              {{ bookshelf.posts[i].comment }}
            </p>
            <w-button
              v-show="hover"
              v-if="checkIfDeleteable(post)"
              @click="deletePost(bookshelf.posts[i]._id, bookshelf._id)"
              class="mt1 ml3"
            >
              Delete
              <w-icon>mdi mdi-delete</w-icon>
            </w-button>
          </w-flex>
        </div>
      </w-card>
      <w-flex justify-center align-center column>
        <h1>Add a Comment</h1>
        <w-input
          class="mt2 mb4 pl5 pr5"
          bg-color="secondary"
          type="text"
          label="Leave A Comment"
          v-model="postInput"
          @keydown.enter.stop="postPosts()"
        />
        <w-button @click="postPosts()">Add Comment</w-button>
      </w-flex>
    </div>
  </div>
</template>

<script>
import Search from "../models/search";
export default {
  name: "FriendsBookshelf",
  setup() {
    const { postBook, shuffle } = Search();
    return { postBook, shuffle };
  },
  data() {
    return {
      viewComments: false,
      hover: false,
      id: "",
      username: "",
      books: [],
      bookshelf: {},
      isBookOpen: false,
      IndexOfOpenedBook: null,
      postInput: "",
      currentUser: "",
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.username = this.$route.params.name;
    this.getFriendsBooks();
    this.getFriendsBookshelf();
    this.getSession();
  },
  methods: {
    test() {},
    compareName(name) {
      if (name === this.username) {
        return true;
      } else {
        return false;
      }
    },
    openLink(link) {
      window.open(link);
    },
    async postPosts() {
      if (this.postInput != "") {
        let newPost = {
          comment: this.postInput,
          bookshelf_id: this.bookshelf._id,
        };
        await fetch(`http://localhost:3000/posts`, {
          method: "POST",
          body: JSON.stringify(newPost),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        this.postInput = "";
        this.getFriendsBookshelf();
        this.postInput = "";
      }
    },

    async getFriendsBookshelf() {
      let response = await fetch(
        `http://localhost:3000/bookshelves/${this.id}`,
        {
          credentials: "include",
        }
      );
      let data = await response.json();
      this.bookshelf = data;
    },
    async getFriendsBooks() {
      let response = await fetch(
        `http://localhost:3000/bookshelves/books/${this.id}`,
        {
          credentials: "include",
        }
      );
      let data = await response.json();
      this.books = data.listOfBooks;
    },

    bookClickHandler(index) {
      this.$emit("openBookContent");
      if (this.IndexOfOpenedBook != index && this.isBookOpen === false) {
        this.openBookContent(index);
        this.IndexOfOpenedBook = index;
        this.isBookOpen = true;
        this.IndexOfOpenedBook = index;
      } else if (this.IndexOfOpenedBook === index && this.isBookOpen === true) {
        this.closeBookContent(index);
        this.isBookOpen = false;
      } else if (
        this.IndexOfOpenedBook === index &&
        this.isBookOpen === false
      ) {
        this.openBookContent(index);
        this.isBookOpen = true;
      } else {
        try {
          this.closeBookContent(this.IndexOfOpenedBook);
          this.openBookContent(index);
          this.IndexOfOpenedBook = index;
        } catch (error) {
          null;
        }
      }
    },
    openBookContent(index) {
      this.$emit("openBookContent");
      if (window.innerWidth <= 684) {
        this.$refs.bookContent[index].style.height = "390px";
      } else {
        this.$refs.bookContent[index].style.width = "256px";
      }
      this.$refs.bookContent[index].style.visibility = "visible";
      // this.$refs.amazon[index].style.visibility = "visible";
    },
    closeBookContent(index) {
      this.$emit("closeBookContent");
      if (window.innerWidth <= 684) {
        this.$refs.bookContent[index].style.width = "256px";
        this.$refs.bookContent[index].style.height = "0px";
      } else {
        this.$refs.bookContent[index].style.width = "0px";
      }
      // this.$refs.amazon[index].style.visibility = "hidden";
      this.$refs.bookContent[index].style.visibility = "hidden";
    },
    closeAllBooks() {
      if (this.isBookOpen === true) {
        this.closeBookContent(this.IndexOfOpenedBook);
        this.isBookOpen = false;
      }
    },

    async deletePost(postID, bookshelfID) {
      await fetch(
        `http://localhost:3000/posts/${postID}/bookshelf/${bookshelfID}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      this.getFriendsBookshelf();
    },

    async getSession() {
      let response = await fetch("http://localhost:3000/session", {
        credentials: "include",
      });
      if (response.status == 200) {
        let data = await response.json();
        this.currentUser = data.username;
      }
    },

    checkIfDeleteable(post) {
      if (this.currentUser == post.username) {
        return true;
      }
    },
  },
};
</script>

<style scoped>
@import "../book-data/style.css";

.reverse-end-post {
  justify-content: end;
  flex-direction: row-reverse;
}

h1 {
  color: rgb(201, 201, 201);
}

#comments p {
  color: white;
}

i {
  color: #c9c9c9;
}

#getbooks {
  align-self: center;
}

#wrapper {
  grid-column: 1/-1;
  grid-row: 2/3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#bookCollection {
  grid-column: 1/-1;
  grid-row: 2/3;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
}

#bookCollection > * {
  margin: 0.5rem;
}

#comments {
  width: 70vw;
  max-height: 700px;
  max-width: 700px;
  overflow-y: scroll;
  overflow: scroll;
}

#comments::-webkit-scrollbar {
  width: 15px;
  height: 18px;
}

#comments::-webkit-scrollbar-thumb {
  height: 6px;
  border: 1px solid rgba(0, 0, 0, 0);
  background-clip: padding-box;
  background-image: linear-gradient(
    to bottom right,
    rgb(52, 52, 105),
    rgb(28, 40, 96)
  );
  border-radius: 10px;
  box-shadow: inset -1px -1px 0px rgba(0, 0, 0, 0.18),
    inset 1px 1px 0px rgba(0, 0, 0, 0.18);
}

#comments::-webkit-scrollbar-button {
  display: none;
  width: 0;
  height: 0;
}

#comments::-webkit-scrollbar-corner {
  background-color: transparent;
}

@media only screen and (max-width: 684px) {
  #comments {
    max-height: 400px;
    max-width: 325px;
  }
}
</style>
