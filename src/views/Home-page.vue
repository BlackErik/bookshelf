<template>
  <div id="wrapper" @dblclick="closeAllBooks()">
    <div class="message-box">
      <w-transition-fade>
        <w-alert
          v-if="state.responseStatus === 400"
          error
          no-border
          class="my0 text-light"
          >This Book Is Already In Your Bookshelf</w-alert
        >
        <w-alert
          v-if="state.responseStatus === 200"
          success
          no-border
          class="my0 text-light"
          >Book Added Successfully</w-alert
        >
      </w-transition-fade>
    </div>
    <h1 class="mt12 mb8">Public Shelves</h1>
    <div class="user-shelf">
      <div v-for="(object, i) in books" :key="i">
        <router-link
          :to="{
            name: 'FriendsBookshelf',
            params: { name: object.username, id: object.user_id },
          }"
        >
          <span class="ml12 pr2 pl2 pb1" id="usernamePublic">
            {{ object.username }}
          </span>
        </router-link>
        <div id="bookCollection">
          <div
            class="book-recommend"
            v-for="(book, index) in object.books"
            :key="index"
          >
            <div
              class="book-box"
              @click="bookClickHandler(`${index + object.username}`)"
            >
              <img class="book-image" :src="`${book.image}`" />
            </div>
            <div
              style="visibility: hidden"
              :ref="`${index + object.username}`"
              class="book-content"
            >
              <div class="text-content">
                <h2 ref="title">{{ book.title }}</h2>
                <!-- Book Title -->
                <w-rating :model-value="book.rating" ref="rating"></w-rating>
                <!-- Book Series Name -->
                <h4 ref="authors">By: {{ book.authors }}</h4>
                <!-- Author's Name -->
                <div class="book-buttons">
                  <w-button
                    ref="link"
                    class="Amazon"
                    @click="openLink(book.link)"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google <w-icon>mdi mdi-link</w-icon></w-button
                  ><!-- Product Link -->
                  <w-button @click="postBook(book)">
                    Save Book<w-icon>mdi mdi-plus</w-icon>
                  </w-button>
                </div>
                <p ref="description" v-html="book.description"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Search from "../models/search";
export default {
  setup() {
    const { postBook, shuffle, state } = Search();
    return { postBook, shuffle, state };
  },
  data() {
    return {
      isBookOpen: false,
      IndexOfOpenedBook: null,
      bookObject: {
        image: "",
        title: "",
        rating: null,
        authors: "",
        link: "",
        description: "",
        isbn: "",
      },
      books: {},
    };
  },
  methods: {
    openLink(link) {
      window.open(link);
    },
    async getPublicBookShelves() {
      let response = await fetch("http://localhost:3000/bookshelves/public");
      let data = await response.json();
      this.books = this.shuffle(data);
      this.listOfUsernames = Object.keys(data);
      console.log(data);
    },
    getUsername() {},
    reset() {
      this.isBookOpen = false;
      this.IndexOfOpenedBook = "";
    },
    bookClickHandler(Nindex) {
      console.log(Nindex);
      this.$emit("openBookContent");
      if (this.IndexOfOpenedBook != Nindex && this.isBookOpen === true) {
        this.openBookContent(Nindex);
        this.closeBookContent(this.IndexOfOpenedBook);
        this.isBookOpen = true;
        this.IndexOfOpenedBook = Nindex;
      } else if (
        this.IndexOfOpenedBook === Nindex &&
        this.isBookOpen === true
      ) {
        this.closeBookContent(Nindex);
        this.isBookOpen = false;
      } else if (
        this.IndexOfOpenedBook === Nindex &&
        this.isBookOpen === false
      ) {
        this.openBookContent(Nindex);
        this.isBookOpen = true;
      } else {
        this.openBookContent(Nindex);
        this.IndexOfOpenedBook = Nindex;
        this.isBookOpen = true;
      }
    },
    openBookContent(Nindex) {
      console.log(this.$refs);
      this.$emit("openBookContent");
      this.$refs[Nindex][0].style.width = "256px";
      this.$refs[Nindex][0].style.visibility = "visible";
    },
    closeBookContent(Nindex) {
      this.$emit("closeBookContent");
      this.$refs[Nindex][0].style.width = "0px";
      this.$refs[Nindex][0].style.visibility = "hidden";
    },
    closeAllBooks() {
      if (this.isBookOpen === true) {
        this.closeBookContent(this.IndexOfOpenedBook);
        this.isBookOpen = false;
      }
    },
  },
  created() {
    this.reset();
    this.getPublicBookShelves();
  },
};
</script>

<style scoped>
@import "../book-data/style.css";
#usernamePublic:hover {
  background-color: #e3f2fd;
  color: #3f51b5;
}

#usernamePublic {
  background-color: #3f51b5;
  color: #e3f2fd;
}
#wrapper {
  grid-column: 1/-1;
  grid-row: 2/3;
}

h1 {
  color: rgb(201, 201, 201);
}

#bookCollection {
  grid-column: 1/-1;
  grid-row: 2/3;
  display: flex;
  flex-direction: row;
  height: 450px;
  overflow: hidden;
  padding-bottom: 1rem;
}

#bookCollection > * {
  margin: 0.5rem;
}

#bookCollection:hover {
  overflow-x: scroll;
}

#bookCollection::-webkit-scrollbar {
  width: 15px;
  height: 18px;
}

#bookCollection::-webkit-scrollbar-thumb {
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

#bookCollection::-webkit-scrollbar-button {
  display: none;
  width: 0;
  height: 0;
}

#bookCollection::-webkit-scrollbar-corner {
  background-color: transparent;
}

a {
  margin-top: 1rem;
  font-size: 3rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  color: rgb(201, 201, 201);
  font-family: "OCR A", "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}

a:hover {
  background-color: "#3f51b5";
  color: "#e3f2fd";
}
.book-buttons {
  display: flex;
  justify-content: space-evenly;
}

@media only screen and (max-width: 684px) {
  .book-recommend {
    flex-direction: row;
  }

  .book-content {
    height: 390px;
    width: 0px;
  }
}
</style>
