

let isbn;

async function getBooks(){

  try {
    console.log("Connected and we got the values in the array");
    var result  = await fetch("http://localhost:3000/getBooks" , {method:"GET"});
    let books   = await result.json();

    console.log("books from server: ");
    console.log(books);

    let div       = document.getElementById("booksDiv");
    div.innerHTML = "" // we clear the innerHTML before adding anything

    // we are adding the books
    for (b of books) {
      var breakLine = document.createElement("br");
      var book      = document.createElement("input");
      var bookLabel = document.createElement("label");

      var innerHTML = "Title " + b.title + " Author " + b.author + " ISBN "+ b.isbn;
      book.setAttribute("type" , "checkBox");
      book.setAttribute("id" , b.isbn);
      book.setAttribute("onchange", "addToCart(this.checked , this.id)");
      bookLabel.innerHTML = innerHTML

      isbn = b.isbn
      div.appendChild(book);
      div.appendChild(bookLabel);
      div.appendChild(breakLine)
    }

  } catch (e){
    console.error("Cound not connect");
    return false
  }

}



async function addToCart(checked , isbn){

  console.log("addToCart: " + checked + " and isbn = " + isbn);

  /*
  let result = await fetch("http://localhost:3000/getBooks",
  {
    method:"POST",
    headers:{
      "content-type":"application/json"
    },
    body:JSON.stringify({isbn:isbn})
  })
  */


}

















// end of program
