const {Client}  = require("pg")
const express   = require("express")
const app       = express()

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

async function connectAndStart(){
  await client.connect();
}
connectAndStart();

app.get("/getUIDs", connectToDB);
async function connectToDB(req, res){
  let result = {}

  try {
    console.log("connectToDB");
    // await client.connect();
    const qResult = await client.query("select u_id from users");
    server_uIDs = qResult.rows;
    console.log(server_uIDs);
    // await client.end();

    res.setHeader("content-type" , "application/json");
    res.status(200).send(JSON.stringify(qResult.rows));

    connected = true
    result.success = true
    console.log("We are logged in");

  } catch (e){
    console.error("getUIDs: Cound not connect");
    connected = false
    result.success = false
  }
  /*finally {
    await client.end();
    res.setHeader("content-type" , "application/json");
    res.status(200).send(JSON.stringify(result));
  }*/

}


app.post("/insertUser" , insertUser);
async function insertUser(req , res){
  let result = {}
  try {

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

    // await client.connect();
    await client.query(insertUserQuery);
    // await client.end();
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

    // we are making the query string
    var insertBookQuery = "insert into users(author, genre, pub_id, num_of_pages, price, isbn, title, percent, pub_name) values(";

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
    insertBookQuery = insertBookQuery.concat(req.body.title);
    insertBookQuery = insertBookQuery.concat("',");

    insertBookQuery = insertBookQuery.concat("'");
    insertBookQuery = insertBookQuery.concat(req.body.precent);
    insertBookQuery = insertBookQuery.concat("',");

    insertBookQuery = insertBookQuery.concat("'");
    insertBookQuery = insertBookQuery.concat(req.body.pub_name);
    insertBookQuery = insertBookQuery.concat("',");

    insertBookQuery = insertBookQuery.concat("'");
    insertBookQuery = insertBookQuery.concat(req.body.quantity);
    insertBookQuery = insertBookQuery.concat("'");


    insertBookQuery = insertBookQuery.concat(")");

    // we are connecting the server
    // await client.connect();
    // execute the query
    await client.query(insertBookQuery);
    // await client.end();
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

    // this query deletes from the server
    let deleteQuery = "delete from books where isbn ="
    deleteQuery = deleteQuery.concat(req.body.remove);
    // await client.connect();
    await client.query(deleteQuery);
    // await client.end();

    result.success = true

  } catch (e){

    result.success = false

  } finally {
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
  }


}





app.get("/getBooks", getBooks);
async function getBooks(req, res){

  try {

    // connecting to server to execute query
    // await client.connect();
    let getBooksResult = await client.query("select * from books");
    let books = getBooksResult.rows;
    // await client.end();

    console.log("getBooks GET: We have gotten the books" + books);

    res.setHeader("content-type" , "application/json");
    res.status(200).send(JSON.stringify(books));

  } catch (e){
    console.error("getBooks GET: Cound not connect");
  }

}





app.post("/getBooks", addToBookStore);
async function addToBookStore(){

  // we got the isbn of the book to add to the Book Store
  let isbn = req.body.isbn
  console.log("addToBookStore: isbn -> " + isbn);

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

    // await client.connect();
    await client.query(addToCartQuery);
    // await client.end();
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




app.listen(3000);




















// end of program
