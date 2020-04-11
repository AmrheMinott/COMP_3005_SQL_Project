

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




async function addToCart(checked , isbn){

  console.log("addToCart: " + checked + " and isbn = " + isbn);

  if (checked){

    let result = await fetch("http://localhost:3000/addToCart",
    {
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify({
        isbn:isbn
      })
    })

  }

}



async function viewCart(){

  try {

    var result  = await fetch("http://localhost:3000/viewCart" , {method:"GET"});
    let booksInCart   = await result.json();

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

  }


}














// end of program
