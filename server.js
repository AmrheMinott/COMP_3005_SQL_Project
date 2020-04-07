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

// client.connect()
// .then(()    => console.log("connectToDB"))
// .catch(e    => console.log())
// .finally(() => client.end())


app.get("/getUIDs", connectToDB);
async function connectToDB(req, res){
  let result = {}

  try {
    console.log("connectToDB");
    await client.connect();
    const qResult = await client.query("select u_id from users");
    server_uIDs = qResult.rows;
    console.log(server_uIDs);
    await client.end();

    res.setHeader("content-type" , "application/json");
    res.status(200).send(JSON.stringify(qResult.rows));

    connected = true
    result.success = true
    console.log("We are logged in");

  } catch (e){
    console.error("Cound not connect");
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

    await client.connect();
    await client.query(insertUserQuery);
    await client.end();
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

    var insertBookQuery = "insert into user(author, genre, pub_id, num_of_pages, price, ISBN, title, percent, pub_name) values(";

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
    insertBookQuery = insertBookQuery.concat("'");


    insertBookQuery = insertBookQuery.concat(")");

    await client.connect();
    await client.query(insertBookQuery);
    await client.end();
    result.success = true

  } catch (e){
    result.success = false

  } finally {
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
  }


}




app.post("/removeBook" , removeBook);
async function removeBook(req, res){

  let result = {}

  try {

    // this query deletes from the server
    let deleteQuery = "delete from book where isbn ="
    deleteQuery = deleteQuery.concat(req.body.remove);
    await client.connect();
    await client.query(deleteQuery);
    await client.end();

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
    await client.connect();
    let getBooksResult = await client.query("select * from book");
    let books = getBooksResult.rows;
    await client.end();

    res.setHeader("content-type" , "application/json");
    res.status(200).send(JSON.stringify(books));

  } catch (e){
    console.error("Cound not connect");
  }

}





app.post("/getBooks", addToBookStore);
async function addToBookStore(){

  let isbn = req.body.isbn

  let result = {}
  // make a query to add to the Book Store using the credetials of the user on the server
  try {

    var addToCartQuery = "insert into bookstore(bill_info, ship_info, order_num, ISBN, u_id) values(";

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
    addToCartQuery = addToCartQuery.concat("'");


    addToCartQuery = addToCartQuery.concat(")");

    await client.connect();
    await client.query(addToCartQuery);
    await client.end();
    result.success = true

  } catch (e){

    result.success = false

  } finally {
    res.setHeader("content-type" , "application/json");
    res.send(JSON.stringify(result));
  }

}


app.post("/userId" , theUserId);
function theUserId(req , res){
  u_id = req.body.u_id
}




app.listen(3000);




















// end of program
