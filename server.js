const {Client}  = require("pg")
const express   = require("express")
const app       = express()
const util = require("util")

app.use(express.json())
app.use(express.static("."))

const client = new Client({
  "user":     "postgres",
  "password": "admin",
  "host":     "localhost",
  "port":     "5432",
  "database": "postgres"
})

let server_uIDs;
let user;
let connected;

let official_uid;


// this is where we go an connect to the postgresql server
connectAndStart();
async function connectAndStart(){
  await client.connect();
}


app.get("/getUIDs", connectToDB);
async function connectToDB(req, res){
  let result = {}

  try {
    console.log("connectToDB");
    const qResult = await client.query("select u_id from users");
    server_uIDs = qResult.rows;
    console.log(server_uIDs);

    res.setHeader("content-type" , "application/json");
    res.status(200).send(JSON.stringify(qResult.rows));

    connected = true
    result.success = true
    console.log("We got logged in");

  } catch (e){
    console.error("getUIDs: Cound not connect");
    connected = false
    result.success = false
  }
  /*finally {
    res.setHeader("content-type" , "application/json");
    res.status(200).send(JSON.stringify(result));
  }*/

}


app.post("/insertUser" , insertUser);
async function insertUser(req , res){
  let result = {}
  try {

    // string that is used to add user to database
    var insertUserQuery = "insert into users(u_id, bill_info, ship_info) values(";

    insertUserQuery = insertUserQuery.concat("'");
    insertUserQuery = insertUserQuery.concat(req.body.u_id);
    insertUserQuery = insertUserQuery.concat("',");

    insertUserQuery = insertUserQuery.concat("'");
    insertUserQuery = insertUserQuery.concat(req.body.ship_info);
    insertUserQuery = insertUserQuery.concat("',");

    insertUserQuery = insertUserQuery.concat("'");
    insertUserQuery = insertUserQuery.concat(req.body.bill_info);
    insertUserQuery = insertUserQuery.concat("'");

    insertUserQuery = insertUserQuery.concat(")");

    await client.query(insertUserQuery);
    result.success = true
    user = req.body

  } catch (e){
    result.success = false

  } finally {
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
  }

}






// the Boss does all of this
app.post("/addBook" , insertBook);
async function insertBook(req , res){

  let result = {}
  try {

    // we are making the query string so we can add the book from the "boss"
    var insertBookQuery = "insert into books (author, genre, pub_id, num_of_pages, price, isbn, title, percent, pub_name, quantity) values(";
    console.log(req.body);
    insertBookQuery = insertBookQuery.concat("'");
    insertBookQuery = insertBookQuery.concat(req.body.author);
    insertBookQuery = insertBookQuery.concat("',");

    insertBookQuery = insertBookQuery.concat("'");
    insertBookQuery = insertBookQuery.concat(req.body.genre);
    insertBookQuery = insertBookQuery.concat("',");

    insertBookQuery = insertBookQuery.concat("'");
    insertBookQuery = insertBookQuery.concat(req.body.pub_id);
    insertBookQuery = insertBookQuery.concat("',");

    insertBookQuery = insertBookQuery.concat("'");
    insertBookQuery = insertBookQuery.concat(req.body.num_of_pages);
    insertBookQuery = insertBookQuery.concat("',");

    insertBookQuery = insertBookQuery.concat("'");
    insertBookQuery = insertBookQuery.concat(req.body.price);
    insertBookQuery = insertBookQuery.concat("',");

    insertBookQuery = insertBookQuery.concat("'");
    insertBookQuery = insertBookQuery.concat(req.body.isbn);
    insertBookQuery = insertBookQuery.concat("',");

    insertBookQuery = insertBookQuery.concat("'");
    insertBookQuery = insertBookQuery.concat(req.body.title);
    insertBookQuery = insertBookQuery.concat("',");

    insertBookQuery = insertBookQuery.concat("'");
    insertBookQuery = insertBookQuery.concat(req.body.percent);
    insertBookQuery = insertBookQuery.concat("',");

    insertBookQuery = insertBookQuery.concat("'");
    insertBookQuery = insertBookQuery.concat(req.body.pub_name);
    insertBookQuery = insertBookQuery.concat("',");

    insertBookQuery = insertBookQuery.concat("'");
    insertBookQuery = insertBookQuery.concat(req.body.quantity);
    insertBookQuery = insertBookQuery.concat("'");


    insertBookQuery = insertBookQuery.concat(")");

    // execute the query that we typed in variable
    await client.query(insertBookQuery);
    result.success = true

    console.log("insertBook: Connection to server: SUCCESS");

  } catch (e){

    console.log("insertBook: Connection to server: NO SUCCESS");
    result.success = false

  } finally {

    console.log("insertBook: Connection to server: Sending");
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));

  }


}




app.post("/removeBook" , removeBook);
async function removeBook(req, res){

  let result = {}

  try {


    // this query deletes from the server a book with a specific ISBN
    let deleteQuery = "delete from books where isbn = '"
    deleteQuery = deleteQuery.concat(req.body.remove);
    deleteQuery = deleteQuery.concat("'");

    // excutes the query
    await client.query(deleteQuery);

    result.success = true

    console.log("removeBook: removing book was a success");

  } catch (e){

    result.success = false
    console.log("removeBook: removing book didn't work");

  } finally {

    console.log("removeBook: sending status to user");
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
  }


}





app.get("/getBooks", getBooks);
async function getBooks(req, res){

  try {

    // connecting to server to execute query
    let getBooksResult = await client.query("select * from books");
    let books = getBooksResult.rows;

    console.log("getBooks GET: We have gotten the books" + books);

    res.setHeader("content-type" , "application/json");
    res.status(200).send(JSON.stringify(books));

  } catch (e){
    console.error("getBooks GET: Cound not connect");
  }

}





app.post("/addToCart", addToBookStoreCart);
async function addToBookStoreCart(){

  // we got the isbn of the book to add to the Book Store
  let isbn = req.body.isbn
  console.log("addToBookStoreCart: isbn -> " + isbn);

  let result = {}
  // make a query to add to the Book Store using the credentials of the user on the server
  try {

    var addToCartQuery = "insert into bookstore(bill_info, ship_info, order_num, isbn, u_id) values(";

    addToCartQuery = addToCartQuery.concat("'");
    addToCartQuery = addToCartQuery.concat(user.bill_info);
    addToCartQuery = addToCartQuery.concat("',");

    addToCartQuery = addToCartQuery.concat("'");
    addToCartQuery = addToCartQuery.concat(user.ship_info);
    addToCartQuery = addToCartQuery.concat("',");

    addToCartQuery = addToCartQuery.concat("'");
    addToCartQuery = addToCartQuery.concat(isbn);
    addToCartQuery = addToCartQuery.concat("',");

    addToCartQuery = addToCartQuery.concat("'");
    addToCartQuery = addToCartQuery.concat(user.u_id);
    // addToCartQuery = addToCartQuery.concat(official_uid);
    addToCartQuery = addToCartQuery.concat("'");


    addToCartQuery = addToCartQuery.concat(")");

    await client.query(addToCartQuery);

    result.success = true

    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));

    console.log("addToBookStore POST: connected to server");

  } catch (e){

    result.success = false

  } finally {
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
    console.log("addToBookStore POST: NOT connected to server");
  }

}


app.post("/userId" , theUserId);
async function theUserId(req , res){
  let result = {}
  official_uid = req.body.u_id
  result.success = true
  console.log("U_ID on server-side in post function theUserId is " + official_uid);

  res.send(JSON.stringify(result));
}




app.listen(3000 , () => console.log("Server is listening on port 3000 of localhost"))




















// end of program
