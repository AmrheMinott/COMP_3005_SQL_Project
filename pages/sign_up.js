

const CHARACTERAMT  = 21
var server_uIDs     = [];


// we connect to the database here to get the all the ids from the database
async function connectToDB(){

  try {
    console.log("Connected and we got the values in the array");
    var result  = await fetch("http://localhost:3000/getUIDs" , {method:"GET"})
    server_uIDs = await result.json();
    console.log(server_uIDs);
  } catch (e){
    console.error("Cound not connect");
    return false
  }

  if (server_uIDs.length > 1 || server_uIDs != undefined){
    return true
  } else {
    return false
  }

}



// get the elements that are to be used in the function below doesSignUpValuesMeetRequirements()
let u_idTextBox       = document.getElementById("u_id");
let ship_infoTextBox  = document.getElementById("ship_info");
let bill_infoTextBox  = document.getElementById("bill_info");

async function doesSignUpValuesMeetRequirements(){

  var present = false

  // connect to database and get the u_id's to check
  if (connectToDB() && Array.isArray(server_uIDs)){

    for (id of server_uIDs){
      if (u_idTextBox.value === id.u_id){
        present = true
      }
    }

    // id is taken so no need for the user to add again
    if (present == true){
      alert("User Id is already taken try something else!");
      return;
    }

    // filters the inputs of the user to see if they meet the required length
    if (ship_infoTextBox.value.length > CHARACTERAMT || bill_infoTextBox.value.length > CHARACTERAMT){
      alert("Please check Shipping Information and Billing Inforamtion as one of them have not met the needed Number of Charcters \n\n ");
    } else if (u_idTextBox.value.length > CHARACTERAMT){
      alert("User Id has not met the number of characters needed!");
    } else {

      if (insertUser()){
        alert("Credentials have been met and Addition was successful")
        window.location.href = "/pages/buying.html"
      } else {
        alert("Credentials have been met but Addition was not successful")
      }

    }

  } else {
    alert("Sign Up Pages says \"There is an issue with connecting to the server, \nso we can not sign you up ATM!\"");
  }

}



// add the user on the page to the postgresql server
async function insertUser(){

  // we are builidng the JSON object to send over to the server
  let body = {}
  body.u_id = u_idTextBox.value;
  body.bill_info = bill_infoTextBox.value;
  body.ship_info = ship_infoTextBox.value;


  let result;

  try {
    // here we make the POST request to the server with the verified data inputs from the user
    result = await fetch ("http://localhost:3000/insertUser", {
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify(body)
    })

    // we get the result back from the user
    result = await result.json()

    // return the true here
    return result.success

  } catch (e){
    //return the false value here
    return result.success
  }


}







// end of program
