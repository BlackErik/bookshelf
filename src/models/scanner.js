const api = require("../../api.config");
import { ref } from "vue";

//google stuff
const googleApiKey = api["API_KEY"];
const googleBooksURL = "https://www.googleapis.com/books/v1";

const Scanner = () => {

  const state = ref({
    searchISBN: "",
    scannedBooks: {},
  });

  function urlString() {
    let numISBN = encodeURIComponent(state.value.searchISBN);
    let key = googleApiKey;
    return "?q=" + numISBN + "+isbn" + "&maxResults=11" + "&key=" + key;
  }

  //returns a json file of related books from searchTitle
  const searchByISBN = async () => {
    try {
      let URLSTRING = urlString();
      await fetch(googleBooksURL + "/volumes" + URLSTRING)
        .then((res) => {
          let response = res.json();
          return response;
        })
        .then((data) => {
          state.value.scannedBooks = data;
        });
    } catch (err) {
      console.log(err);
    }
  };
 
  return {
    state,
    searchByISBN
  };
};

export default Scanner;