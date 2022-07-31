import { ref } from "vue";

const BookShelf = () => {
  const state = ref({
    books: {},
    bookshelf: {},
  });

  const getBooks = async function () {
    let response = await fetch("http://localhost:3000/bookshelves/books", {
      credentials: "include",
    });
    let data = await response.json();
    state.value.books = data.listOfBooks;
  };

  const getBookshelf = async function () {
    let response = await fetch("http://localhost:3000/bookshelves", {
      credentials: "include",
    });
    let data = await response.json();
    state.value.bookshelf = data.bookshelf;
  };

  const deleteBook = async function (bookID) {
    await fetch(`http://localhost:3000/bookshelves/${bookID}`, {
      method: "DELETE",
      credentials: "include",
    });
    this.getBooks();
  };

  return {
    state,
    getBooks,
    deleteBook,
    getBookshelf,
  };
};

export default BookShelf;
