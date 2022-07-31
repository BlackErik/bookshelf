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
    <w-flex class="mt12" justify-center align-center>
      <w-form ref="test" id="searchBar">
        <h5>Search Amount</h5>
        <w-slider
          ref="slider"
          class="big-label.ma12 mt12 ml5 mr5"
          v-model="sliderValue"
          thumb-label
          :max="40"
          :min="10"
        >
        </w-slider>

        <w-input
          class="mt2 mb4 ml5 mr5"
          type="text"
          label="Search"
          @keyup.enter="closeAllBooks(), searchFunc(), searchReset()"
          v-model="state.searchTitle"
          bg-color="secondary"
          autocomplete="off"
        />
      </w-form>
    </w-flex>
    <w-flex justify-center align-center>
      <w-button xl v-on:click="closeAllBooks(), searchFunc(), searchReset()"
        >Search</w-button
      >
      <a id="scanner" class="ml4" bg-color="secondary">
        <img
          @click="toScanner()"
          src="https://static.thenounproject.com/png/473299-200.png"
          alt="scanner"
        />
      </a>
    </w-flex>

    <br />
    <div id="bookCollection">
      <div
        class="book-recommend"
        v-for="(book, index) in state.books"
        :key="index"
      >
        <div ref="bookBox" class="book-box" @click="bookClickHandler(index)">
          <img ref="image" class="book-image" :src="imageTest(book)" />
        </div>
        <div style="visibility: hidden" ref="bookContent" class="book-content">
          <div class="text-content">
            <h2 ref="title">{{ book.volumeInfo.title }}</h2>
            <!-- Book Title -->
            <w-rating
              :model-value="numGive(book.volumeInfo.averageRating)"
              ref="rating"
            >
            </w-rating>
            <!-- Book Rating -->
            <h4 ref="authors">By: {{ textGive(book.volumeInfo.authors) }}</h4>
            <!-- Author's Name -->
            <div class="book-buttons">
              <w-button
                ref="link"
                class="Amazon mr3"
                @click="openLink(book.volumeInfo.infoLink)"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google <w-icon>mdi mdi-link</w-icon></w-button
              ><!-- Product Link -->
              <w-button @click="serveBook(index), postBook(bookObject)">
                Save Book <w-icon>mdi mdi-plus</w-icon>
              </w-button>
            </div>
            <!-- button to add to database -->
            <p ref="description" v-html="snippetGive(book)"></p>
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
    const { state, searchByTitle, postBook } = Search();
    return { state, searchByTitle, postBook };
  },
  data() {
    return {
      sliderValue: 15,
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
    };
  },
  methods: {
    searchFunc() {
      let Num = this.sliderValue;
      this.searchByTitle(Math.floor(Num));
    },
    openLink(link) {
      window.open(link);
    },
    toScanner() {
      this.$router.push({ path: "/scanner" });
    },
    serveBook(index) {
      this.bookObject.image = String(this.$refs.image[index].src);
      this.bookObject.title = this.$refs.title[index].innerHTML;
      this.bookObject.rating = this.numGive(
        this.state.books[index].volumeInfo.averageRating
      );
      this.bookObject.authors = this.textGive(
        this.state.books[index].volumeInfo.authors
      );
      this.bookObject.link = this.$refs.link[index].href;
      this.bookObject.description = this.snippetGive(this.state.books[index]);
      this.bookObject.isbn = this.isbnGive(
        this.state.books[index].volumeInfo.industryIdentifiers
      );
    },
    isbnGive(text) {
      try {
        let isbn;
        for (const i in text) {
          if (text[i].type == "ISBN_13") {
            return text[i].identifier;
          } else if (text[i].type == "ISBN_10") {
            isbn = text[i].identifier;
          }
        }
        return isbn;
      } catch (error) {
        return this.bookObject.link;
      }
    },
    textGive(text) {
      try {
        let goodText = text.join(" ");
        return goodText;
      } catch (error) {
        return "N/A";
      }
    },
    snippetGive(book) {
      try {
        let snippet = book.volumeInfo.description;
        return snippet;
      } catch (error) {
        return book.searchInfo.textSnippet;
      }
    },
    numGive(num) {
      try {
        if (num > 0) {
          return num;
        } else {
          return 0;
        }
      } catch (error) {
        return "N//A";
      }
    },
    imageTest(book) {
      try {
        let thumbnail = book.volumeInfo.imageLinks.thumbnail;
        return thumbnail;
      } catch (error) {
        return "https://cdn.pixabay.com/photo/2018/01/04/15/51/404-error-3060993_1280.png";
      }
    },
    searchReset() {
      this.isBookOpen = false;
      this.IndexOfOpenedBook = null;
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
    },
    closeBookContent(index) {
      this.$emit("closeBookContent");
      if (window.innerWidth <= 684) {
        this.$refs.bookContent[index].style.width = "256px";
        this.$refs.bookContent[index].style.height = "0px";
      } else {
        this.$refs.bookContent[index].style.width = "0px";
      }
      this.$refs.bookContent[index].style.visibility = "hidden";
    },
    closeAllBooks() {
      if (this.isBookOpen === true) {
        this.closeBookContent(this.IndexOfOpenedBook);
        this.isBookOpen = false;
      }
    },
  },
  created() {},
};
</script>

<style scoped>
@import "../book-data/style.css";

#searchSection {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

#wrapper {
  grid-column: 1/-1;
  grid-row: 2/3;
}

#bookCollection {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 5rem;
}

#bookCollection > * {
  margin: 0.5rem;
}

#searchBar {
  width: 100%;
  max-width: 500px;
}

#scanner {
  width: 35px;
  background-color: rgb(201, 201, 201);
  cursor: pointer;
}

#scanner:hover {
  background-color: white;
}

h5 {
  color: rgb(201, 201, 201);
}

#scanner img {
  width: inherit;
  height: inherit;
}
</style>
