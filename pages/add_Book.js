

async function addBook(){

  // here we add a book
  let body = {}

  let author = document.getElementById("author").value;
  let genre = document.getElementById("genre").value;
  let pub_id = document.getElementById("pub_id").value;
  let num_of_pages = document.getElementById("num_of_pages").value;
  let price = document.getElementById("price").value;
  let title = document.getElementById("title").value;
  let percent = document.getElementById("percent").value;
  let pub_name = document.getElementById("pub_name").value;

  body.author = author;
  body.genre = genre;
  body.pub_id = pub_id;
  body.num_of_pages = num_of_pages;
  body.price = price;
  body.title = title;
  body.percent = percent;
  body.pub_name = pub_name;

  let success = await fetch ("http://localhost:3000/addBook", {method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify(body)})

  return success.success

}




async function removeBookByISBN(){
  // we take the isbn to remove the book

  let isbn = document.getElementById("isbn").value;
  await fetch ("http://localhost:3000/removeBook",
  {
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify({remove:isbn})
  })
}


















// end of program
