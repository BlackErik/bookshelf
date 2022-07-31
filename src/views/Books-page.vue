<template>
  <div id="wrapper">
    <w-flex row justify-center align-center class="mt12" gap="3">
      <w-button
        lg
        v-if="state.bookshelf.public === true"
        @click="patchBookShelfPublic()"
        >Public Bookshelf</w-button
      >
      <w-button lg v-else @click="patchBookShelfPublic()"
        >Private Bookshelf</w-button
      >
      <w-button lg v-show="viewComments === false" @click="viewComments = true"
        >See Comments</w-button
      >
      <w-button lg v-show="viewComments === true" @click="viewComments = false"
        >See Books</w-button
      >
    </w-flex>

    <div id="bookCollection" v-show="viewComments === false">
      <div
        class="book-recommend"
        v-for="(book, index) in state.books"
        :key="index"
      >
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
            <div class="book-buttons">
              <w-button
                :value="`${index}`"
                ref="amazon"
                class="Amazon mr3"
                @click="openLink(book.link)"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google
                <w-icon>mdi mdi-link</w-icon></w-button
              ><!-- Product Link -->
              <w-button @click="closeAllBooks(), deleteBook(book._id)" s>
                DELETE <w-icon>mdi mdi-delete</w-icon>
              </w-button>
            </div>
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
        <div v-for="(post, i) in state.bookshelf.posts" :key="i">
          <w-flex
            class="mb6"
            :class="{
              'reverse-end-post': !compareName(
                state.bookshelf.posts[i].username
              ),
            }"
            align-center
            row
            wrap
          >
            <w-tag lg color="secondary" bg-color="primary" class="mr4 ml4">{{
              state.bookshelf.posts[i].username
            }}</w-tag>
            <p class="mr1 ml1" color="secondary">
              {{ state.bookshelf.posts[i].comment }}
            </p>
            <w-button
              v-show="hover"
              @click="
                deletePost(state.bookshelf.posts[i]._id, state.bookshelf._id)
              "
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
import BookShelf from "../models/books";
export default {
  setup() {
    const { state, getBooks, deleteBook, getBookshelf } = BookShelf();
    return { state, getBooks, deleteBook, getBookshelf };
  },
  data() {
    return {
      viewComments: false,
      isBookOpen: false,
      IndexOfOpenedBook: null,
      postInput: "",
      hover: false,
      username: "",
    };
  },
  methods: {
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
      let newPost = {
        comment: this.postInput,
        bookshelf_id: this.state.bookshelf._id,
      };
      await fetch(`http://localhost:3000/posts`, {
        method: "POST",
        body: JSON.stringify(newPost),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      this.getBookshelf();
      this.postInput = "";
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

    async patchBookShelfPublic() {
      let requestBody = {};
      if (this.state.bookshelf.public == true) {
        requestBody["public"] = false;
      } else {
        requestBody["public"] = true;
      }
      await fetch("http://localhost:3000/bookshelves", {
        credentials: "include",
        method: "PATCH",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      this.getBookshelf();
    },
    async deletePost(postID, bookshelfID) {
      await fetch(
        `http://localhost:3000/posts/${postID}/bookshelf/${bookshelfID}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      this.getBookshelf();
    },
    async getSession() {
      let response = await fetch("http://localhost:3000/session", {
        credentials: "include",
      });
      if (response.status == 200) {
        let data = await response.json();
        this.username = data.username;
      }
    },
  },
  created: function () {
    this.getBooks();
    this.getBookshelf();
    this.getSession();
  },
};
</script>

<style scoped>
@import "../book-data/style.css";

.reverse-end-post {
  justify-content: end;
  flex-direction: row-reverse;
}

#comments p {
  color: white;
}
i {
  color: #c9c9c9;
}
h1 {
  color: #c9c9c9;
}

#getBooks {
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
  overflow: auto;
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
