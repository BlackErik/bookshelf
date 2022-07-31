import { ref } from "vue";
const api = require("../../api.config");

//google stuff
const googleApiKey = api["API_KEY"];
const googleBooksURL = "https://www.googleapis.com/books/v1";

const SearchBar = () => {
  const state = ref({
    searchTitle: "",
    books: {},
    responseStatus: null,
  });

  //makes the querystring and adds the needed api string for the GET of google books api
  //example : [?q=<searchTitle>&key=<googleApiKey>]
  //this needs to be appended to the url
  function urlString(Num) {
    let title = encodeURIComponent(state.value.searchTitle);

    let key = googleApiKey;
    let num = Num;
    return "?q=" + title + "&maxResults=" + num + "&key=" + key;
  }

  //returns a json file of related books from searchTitle
  const searchByTitle = async (Num) => {
    try {
      let URLSTRING = urlString(Num);
      await fetch(googleBooksURL + "/volumes" + URLSTRING)
        .then((res) => {
          let response = res.json();
          return response;
        })
        .then((data) => {
          state.value.books = shuffle(data.items);
        });
    } catch (err) {
      console.log(err);
    }
  };

  //shuffle
  const shuffle = function (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const postBook = async function (book) {
    let newBook = {
      image: book.image,
      title: book.title,
      rating: book.rating,
      authors: book.authors,
      link: book.link,
      description: book.description,
      isbn: book.isbn,
    };
    let response = await fetch("http://localhost:3000/bookshelves", {
      method: "POST",
      body: JSON.stringify(newBook),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status == 400) {
      state.value.responseStatus = response.status;
    } else if (response.status == 200) {
      state.value.responseStatus = response.status;
    } else {
      state.value.responseStatus = response.status;
    }
  };

  return {
    state,
    searchByTitle,
    postBook,
    shuffle,
  };
};

export default SearchBar;
