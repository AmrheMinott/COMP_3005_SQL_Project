const {Client}  = require("pg") // postgres node.js creation
const express   = require("express")
const app       = express() // this give me the ability to make request going in and out of th server
const util      = require("util") // so I can print things that look nice
const unique    = require("uuid") // generates a unique string of characters

app.use(express.json())
app.use(express.static("."))


// this is the postgres account details used to sign into the server. This may have to change interms of the user, password, port and databse name
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


// this goes on the SQL databse and gets the user id that are present in the USER table.
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





app.post("/addToCart", addToBookStoreCart);
async function addToBookStoreCart(req , res){

  // we got the isbn of the book to add to the Book Store
  let isbn = req.body.isbn
  console.log("addToBookStoreCart: isbn -> " + isbn);

  let result = {}
  // make a query to add to the Book Store using the credentials of the user on the server
  try {

    // gets me the user's ship_info and bill_info based on that u_id
    let currentUserResult =  await client.query("select * from users where u_id = '" + official_uid + "'")
    let currentUser = currentUserResult.rows
    console.log("addToBookStoreCart: official_uid = " + official_uid + " currentUser ");
    console.log(currentUser);


    // this is where the query is built to be sent to the server to add the order by the user
    var addToCartQuery = "insert into bookstore(bill_info, ship_info, isbn, u_id) values(";


    console.log("addToBookStoreCart: currentUser[0].bill_info " + currentUser[0].bill_info);

    // this if statement using determines if the user actually has a file for us to add their bill_info and ship_info to the query
    if (currentUser[0].bill_info != undefined){
      // here we are building the SQL query by taking the values from the body of the POST request
      addToCartQuery = addToCartQuery.concat("'");
      addToCartQuery = addToCartQuery.concat(currentUser[0].bill_info);
      addToCartQuery = addToCartQuery.concat("',");

      addToCartQuery = addToCartQuery.concat("'");
      addToCartQuery = addToCartQuery.concat(currentUser[0].ship_info);
      addToCartQuery = addToCartQuery.concat("',");

      // addToCartQuery = addToCartQuery.concat("'");
      // addToCartQuery = addToCartQuery.concat(order_num.substring(0,21));
      // addToCartQuery = addToCartQuery.concat("',");

      addToCartQuery = addToCartQuery.concat("'");
      addToCartQuery = addToCartQuery.concat(isbn);
      addToCartQuery = addToCartQuery.concat("',");

      addToCartQuery = addToCartQuery.concat("'");
      addToCartQuery = addToCartQuery.concat(currentUser[0].u_id);
      // addToCartQuery = addToCartQuery.concat(official_uid);
      addToCartQuery = addToCartQuery.concat("'");


      addToCartQuery = addToCartQuery.concat(")");

      // execute add query to the bookstore i.e. the cart
      await client.query(addToCartQuery);
    }



    // when the book is added to the cart then the quantity is decreased for that book
    var updateQuantityQuery = "update books set quantity = quantity - 1 where isbn = '" + isbn + "'"

    await client.query(updateQuantityQuery)

    result.success = true

    console.log("addToBookStore POST: Query Execution was a success");

  } catch (e){

    result.success = false
    console.log("addToBookStore POST: Query Execution was NOT a success");

  } finally {
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
    console.log("addToBookStore POST: something was sent ");
    console.log(result);
  }

}



// this route and accompanying function gets the orders that the user has made on the server
app.get("/viewCart" , viewCart)
async function viewCart(req , res){


  let result = {}

  try {

    // this query gets all the books on the server for the user id
    var getItemsInCartQuery = "select * from bookstore where u_id = '"+official_uid + "'"

    console.log("official_uid = " + official_uid);
    let query = await client.query(getItemsInCartQuery)

    result.success = true
    result.result = query.rows
    console.log("viewCart POST: Query Execution was a success");


  } catch (e){

    result.success = false
    console.log("viewCart POST: Query Execution was NOT a success");

  } finally {
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
    console.log("official_uid => " + official_uid);
    console.log(result);
  }

}


// this is the route we are using to remove the book from the bookstore table on the postgres pg4Admin
app.post("/removeFromCart", removeFromBookStoreCart);
async function removeFromBookStoreCart(req , res){

  let result = {}

  try {

    // make a query to remove a book from Book Store using the u_id and isbn of the specified book
    var deleteFromCartQuery = "delete from bookstore where u_id = '" +
    req.body.u_id + "'" + " and isbn = '" + req.body.isbn + "'"

    await client.query(deleteFromCartQuery);

    console.log("removeFromBookStoreCart POST: Query Execution was a success");

    result.success = true

  } catch (e){

    result.success = false
    console.log("removeFromBookStoreCart POST: Query Execution was NOT a SUCCESS");

  } finally {
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
    console.log("removeFromBookStoreCart POST: something was sent");
    console.log(result);
  }

}


// updates the number of books for the specified isbn on the server
app.post("/updateQuantity" , updateQuantity)
async function updateQuantity(req, res){

  let loopCount = 0
  let result
  for (var i = 0; i < req.body.count; i++){

    try {

      // when the book is removed from the cart then the quantity is increased for that book
      var updateQuantityQuery = "update books set quantity = quantity + 1 where isbn = '" + req.body.isbn + "'"

      console.log("updateQuantity: Inside the for loop");

      await client.query(updateQuantityQuery)

      result = true

      console.log("updateQuantity: Query Execution was a SUCCESS");
      console.log(result);
    } catch {
      console.log("updateQuantity: Query Execution was NOT a SUCCESS");
      result = false
      console.log(result);
    } finally {
      console.log("updateQuantity: FINALLY");
      console.log(result);
    }

    loopCount ++
  }
  console.log("loopCount " + loopCount);

}


app.post("/userId" , theUserId);
async function theUserId(req , res){
  let result = {}
  official_uid = req.body.u_id
  result.success = true
  console.log("U_ID on server-side in post function theUserId is " + official_uid);

  res.send(JSON.stringify(result));
  console.log(result);
}



// the Boss does all of this
app.post("/addBook" , insertBook);
async function insertBook(req , res){

  let result = {}
  try {

    // we are making the query string so we can add the book from the "boss"
    var insertBookQuery = "insert into books (author, genre, pub_id, num_of_pages, price, isbn, title, percent, pub_name, quantity) values(";

    console.log(req.body);

    // here I generate a unique ID and i'm using that UUID to create the Publisher Id for the Database pub_id
    var isbn = unique.v4()
    console.log("First 8 characters of " + isbn.substring(0,8));


    // here we are building the SQL query by taking the values from the body of the POST request
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
    // insertBookQuery = insertBookQuery.concat(req.body.isbn);
    insertBookQuery = insertBookQuery.concat(isbn.substring(0,8));
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

    console.log("insertBook: Query Execution was a SUCCESS");

  } catch (e){

    console.log("insertBook: Query Execution was NOT a SUCCESS");
    result.success = false

  } finally {

    console.log("insertBook: Connection to server: Sending");
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
    console.log("insertBook: something was sent");
    console.log(result);

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

    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
    console.log("removeBook: something was sent");
    console.log(result);

  }


}





app.get("/getBooks", getBooks);
async function getBooks(req, res){

  try {

    // connecting to server to execute query
    let getBooksResult = await client.query("select * from books");
    let books = getBooksResult.rows;

    console.log("getBooks GET: We have gotten the books")
    console.log(books);

    res.setHeader("content-type" , "application/json");
    res.status(200).send(JSON.stringify(books));

  } catch (e){
    console.error("getBooks GET: Cound not connect");
  }

}







app.listen(3000 , () => console.log("Server is listening on port 3000 of localhost"))




















// end of program
