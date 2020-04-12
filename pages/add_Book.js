

async function addBook(){

  // here we add a book
  let body = {}

  let author = document.getElementById("author").value;
  let genre = document.getElementById("genre").value;
  let pub_id = document.getElementById("pub_id").value;
  let num_of_pages = document.getElementById("num_of_pages").value;
  let price = document.getElementById("price").value;
  // let isbn = document.getElementById("isbn").value;
  let title = document.getElementById("title").value;
  let percent = document.getElementById("percent").value;
  let pub_name = document.getElementById("pub_name").value;
  let quantity = document.getElementById("quantity").value;

  body.author = author;
  body.genre = genre;
  body.pub_id = pub_id;
  body.num_of_pages = num_of_pages;
  body.price = price;
  // body.isbn = isbn;
  body.title = title;
  body.percent = percent;
  body.pub_name = pub_name;
  body.quantity = quantity;

  let success;

  try {
    success = await fetch ("http://localhost:3000/addBook", {
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify(body)
    })

    console.log("Success of books addition was a " + success.success);

    if (success.success){
      alert("Book was added nicely")
    } else {
      alert("There appears to be an issue")
    }

    return success.success
  } catch (e) {
    return success.success
    console.log("ISSUE catch e" + e);
  }


}




async function removeBookByISBN(){
  // we take the isbn to remove the book

  let isbn = document.getElementById("isbnRemove").value;
  await fetch ("http://localhost:3000/removeBook",
  {
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify({remove:isbn})
  })
}




let authorsDiv = document.getElementById("authorPerSalesDiv")

// makes a request to the running server for the sales per author
async function getAuthorReport(){

  try {

    authorsDiv.innerHTML = "" // set innerHTML to null when called

    // gets the result from the server
    var result = await fetch("http://localhost:3000/authorPerSalesRoute" , {method:"GET"});
    let report = await result.json(); // parses result from server

    // we are adding the reports for the author
    for (r of report) {
      var breakLine = document.createElement("br");
      var reportLabel = document.createElement("label");

      var innerHTML = "Author " + r.author + " Total " + r.sum;

      reportLabel.innerHTML = innerHTML

      authorsDiv.appendChild(reportLabel);
      authorsDiv.appendChild(breakLine)
    }


  } catch (e){
    console.log("getAuthorReport: ERROR occured" + e);
  }

}



let genreDiv = document.getElementById("genrePerSalesDiv")

// makes a request to the running server for the sales per genre
async function getGenreReport(){

  try {

    genreDiv.innerHTML = "" // set innerHTML to null when called

    // gets the result from the server
    var result = await fetch("http://localhost:3000/genrePerSalesRoute" , {method:"GET"});
    let report = await result.json(); // parses result from server


    // we are adding the reports for the genre
    for (r of report) {
      var breakLine = document.createElement("br");
      var reportLabel = document.createElement("label");

      var innerHTML = "Genre " + r.genre + " Total " + r.sum;

      reportLabel.innerHTML = innerHTML

      genreDiv.appendChild(reportLabel);
      genreDiv.appendChild(breakLine)
    }


  } catch (e){
    console.log("getGenreReport: ERROR occured" + e);
  }

}











// end of program
