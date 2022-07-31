<template>
  <div id="wrapper">
    <div class="message-box">
      <w-transition-fade>
        <w-alert
          v-if="state.responseStatus === 400"
          error
          no
          border
          clas="my0 text-light"
        >
          This Book Is Already In Your Bookshelf</w-alert
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
    <StreamBarcodeReader
      ref="scannerCam"
      v-show="bookSearched === false"
      @decode="(isbn) => onDecode(isbn)"
      @loaded="() => onLoaded()"
    ></StreamBarcodeReader>
    <w-flex class="pt8" justify-center>
      <w-button xl v-show="bookSearched === true" @click="bookSearched = false">
        Scan Again
      </w-button>
    </w-flex>
    <div id="bookCollection" v-show="bookSearched === true">
      <div
        class="book-recommend"
        v-for="(book, index) in state.scannedBooks.items"
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
            ></w-rating>
            <!-- Book Rating -->
            <h4 ref="authors">By: {{ textGive(book.volumeInfo.authors) }}</h4>
            <!-- Author's Name -->
            <div class="book-buttons">
              <w-button
                ref="link"
                class="Amazon"
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
import StreamBarcodeReader from "../components/Scanner-section.vue";
import Search from "@/models/search";
import Scanner from "@/models/scanner";
export default {
  name: "HelloWorld",
  setup() {
    const { state, searchByISBN } = Scanner();
    const { postBook } = Search();
    return { state, searchByISBN, postBook };
  },
  data() {
    return {
      id: null,
      bookSearched: false,
      isBookOpen: false,
      IndexOfOpenedBook: null,
      bookObject: {
        image: "",
        title: "",
        // rating: null,
        authors: "",
        link: "",
        description: "",
        isbn: "",
      },
    };
  },
  components: {
    StreamBarcodeReader,
  },
  methods: {
    openLink(link) {
      window.open(link);
    },
    onDecode(isbn) {
      this.state.searchISBN = isbn;
      this.bookSearched = true;
      this.searchByISBN();
      this.id = isbn;
      if (this.id) clearTimeout(this.id);
      this.id = setTimeout(() => {
        if (this.id === isbn) {
          this.id = null;
        }
      }, 5000);
    },
    onLoaded() {},
    serveBook(index) {
      this.bookObject.image = String(this.$refs.image[index].src);
      this.bookObject.title = this.$refs.title[index].innerHTML;
      this.bookObject.rating = this.numGive(
        this.state.scannedBooks.items[index].volumeInfo.averageRating
      );
      this.bookObject.authors = this.textGive(
        this.state.scannedBooks.items[index].volumeInfo.authors
      );
      this.bookObject.link = this.$refs.link[index].href;
      this.bookObject.description = this.snippetGive(
        this.state.scannedBooks.items[index]
      );
      this.bookObject.isbn = this.isbnGive(
        this.state.scannedBooks.items[index].volumeInfo.industryIdentifiers
      );
      console.log(this.bookObject);
    },
    isbnGive(text) {
      try {
        for (const i in text) {
          if (text[i].type == "ISBN_13") {
            return text[i].identifier;
          }
        }
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
        return 0;
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
};
</script>
<style scoped>
@import "../book-data/style.css";
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

#wrapper {
  grid-column: 1/-1;
  grid-row: 2/3;
  color: white;
}
.book-buttons {
  display: flex;
  justify-content: space-evenly;
}

.book-buttons button {
  background-color: #3f51b5;
  color: white;
  border-radius: 0;
  border: none;
  padding: 5px;
  cursor: pointer;
}
</style>
