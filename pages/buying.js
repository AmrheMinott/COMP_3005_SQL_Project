
let isbn;

async function getBooks(){

  try {
    console.log("Connected and we got the values in the array");
    var result  = await fetch("http://localhost:3000/getBooks" , {
      method:"GET"
    });
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
      bookLabel.setAttribute("id" , b.isbn + "label")

      isbn = b.isbn
      div.appendChild(book);
      div.appendChild(bookLabel);
      div.appendChild(breakLine)
    }

  } catch (e){
    console.error("Cound not connect");
  }

}



// this function adds the selected books on the server of the bookstore
async function addToCart(checked , isbnID){

  console.log("addToCart: checked = " + checked + " and isbn = " + isbnID);

  var label = document.getElementById(isbnID+"label")
  if (checked){

    label.style.backgroundColor = "#00FF00";

    // we make the POST request to server
    let result = await fetch("http://localhost:3000/addToCart", {
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify({
        isbn:isbnID
      })
    })

  } else {
    label.style.backgroundColor = "";
  }

}



// this function makes me see the information on the bookstore
async function viewCart(){

  try {

    var result  = await fetch("http://localhost:3000/viewCart" , {method:"GET"});
    let booksInCart = await result.json();

    let div       = document.getElementById("viewCartDiv");
    div.innerHTML = "" // we clear the innerHTML before adding anything

    let theUserIdFromCart

    // we are adding the books the user has in the cart currently to be displayed on the screen if there was a success on the server
    if (booksInCart.success){

      // this object has the u_id of the specified user
      for (b of booksInCart.result) {
        var breakLine = document.createElement("br");
        var book      = document.createElement("input");
        var bookLabel = document.createElement("label");

        var innerHTML = "Order Number " + b.order_num + " ISBN " + b.isbn
        book.setAttribute("type" , "checkBox");
        book.setAttribute("id" , b.isbn);
        book.setAttribute("name" , b.u_id);
        book.setAttribute("onchange", "removeFromCart(this.checked , this.id, this.name)");
        bookLabel.innerHTML = innerHTML

        div.appendChild(book)
        div.appendChild(bookLabel)
        div.appendChild(breakLine)

        theUserIdFromCart = b.u_id
      }

    }

    let para = document.getElementById("usersid")

    // we get what time of day it is based ont he hour of the day
    var hr = (new Date()).getHours();

    // based on that hour we display an appropriate welcome to the user
    if (hr >= 2 && hr<11){

      if (theUserIdFromCart){
        para.innerHTML = "Good Morning " + theUserIdFromCart + " Your Orders are Below"
      } else {
        para.innerHTML = "Good Morning Your Orders are Below"
      }

    } else if (hr >= 11 && hr < 17){

      if (theUserIdFromCart){
        para.innerHTML = "Good Afternoon " + theUserIdFromCart + " Your Orders are Below"
      } else {
        para.innerHTML = "Good Afternoon Your Orders are Below"
      }

    } else {

      if (theUserIdFromCart){
        para.innerHTML = "Good Night " + theUserIdFromCart + " Your Orders are Below"
      } else {
        para.innerHTML = "Good Night Your Orders are Below"
      }

    }

  } catch(e) {
    console.error("ERROR viewCart():" + e);
  }

}



// this function is called from the onchange of the checkBoxes of the viewCart div
async function removeFromCart(checked , isbn, u_id){

  if (checked){

    // we make the POST request to server
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
  await fetch("http://localhost:3000/updateQuantity", {
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
