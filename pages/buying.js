
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

    // we are adding the books to the div
    for (b of books) {
      var breakLine = document.createElement("br");
      var book      = document.createElement("input");
      var bookLabel = document.createElement("label");

      var innerHTML = "Title " + b.title + " Author " + b.author + " ISBN " + b.isbn + " Quantity " + b.quantity;
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



// this function adds the selected books on the server of the bookstore
async function addToCart(checked , isbnID){

  console.log("addToCart: checked = " + checked + " and isbn = " + isbnID);

  if (checked){

    let result = await fetch("http://localhost:3000/addToCart",
    {
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify({
        isbn:isbnID
      })
    })

  }

}


// this function makes me see the information on the bookstore
async function viewCart(){

  try {

    var result  = await fetch("http://localhost:3000/viewCart" , {method:"GET"});
    let booksInCart = await result.json();

    let div       = document.getElementById("viewCartDiv");
    div.innerHTML = "" // we clear the innerHTML before adding anything


    // we are adding the books the user has in the cart currently to be displayed on the screen if there was a success on the server
    if (booksInCart.success){

      // this object has the u_id of the specified user
      for (b of booksInCart.result) {
        var breakLine = document.createElement("br");
        var book      = document.createElement("input");
        var bookLabel = document.createElement("label");

        var innerHTML = "Order Number " + b.order_num + " ISBN " + b.isbn + " User ID " + b.u_id;
        book.setAttribute("type" , "checkBox");
        book.setAttribute("id" , b.isbn);
        book.setAttribute("name" , b.u_id);
        book.setAttribute("onchange", "removeFromCart(this.checked , this.id, this.name)");
        bookLabel.innerHTML = innerHTML

        div.appendChild(book);
        div.appendChild(bookLabel);
        div.appendChild(breakLine)
      }

    }

  } catch(e) {
    console.error("ERROR viewCart():" + e);
  }


}


// this function is called from the onchange of the checkBoxes of the viewCart div
async function removeFromCart(checked , isbn, u_id){

  if (checked){

    let result = await fetch("http://localhost:3000/removeFromCart",
    {
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify({
        isbn:isbn,
        u_id:u_id
      })
    })

    // makes a request to the server
    updateQuantityFunction(isbn)
  }


}


// this function updates quantity of book on the server
async function updateQuantityFunction(isbn){

  // get the div where all the input tags are
  let div = document.getElementById("viewCartDiv");

  let counter = 0;

  // get all the children
  let children = div.childNodes;

  // we are looking for the INPUT tags and the one that have a the isbn of the book that we are looking for exactly
  for (child of children){
    if (child.tagName == "INPUT" && child.id == isbn){
      counter ++;
    }
  }

  console.log("counter: " + counter + " isbn " + isbn);

  // make a POST request to the server to update the values for the quntity on the books on the server
  await fetch("http://localhost:3000/updateQuantity",
  {
    method:"POST",
    headers:{
      "content-type":"application/json"
    },
    body:JSON.stringify({
      count:counter,
      isbn:isbn
    })
  })


}








// end of program
