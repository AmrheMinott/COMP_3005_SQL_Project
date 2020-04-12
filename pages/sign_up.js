

const CHARACTERAMT  = 21
var server_uIDs     = [];

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




let u_idTextBox       = document.getElementById("u_id");
let ship_infoTextBox  = document.getElementById("ship_info");
let bill_infoTextBox  = document.getElementById("bill_info");

async function doesSignUpValuesMeetRequirements(){

  var present = true

  // connect to database and get the u_id's to check
  if (connectToDB() && Array.isArray(server_uIDs)){

    for (id of server_uIDs){
      if (u_idTextBox.value === id.u_id){
        present = false
        console.log("In for loop checking to see if user already exist u_idTextBox.value " + u_idTextBox.value + " && u_id " + id.u_id);
      }
    }

    if (present == false){
      alert("User Id is already taken try something else!");
      return;
    }

    if (ship_infoTextBox.value.length != CHARACTERAMT || bill_infoTextBox.value.length != CHARACTERAMT){
      alert("Please check Shipping Information and Billing Inforamtion as one of them have not met the needed Number of Charcters \n\n ");
    } else if (u_idTextBox.value.length != CHARACTERAMT){
      alert("User Id has not met the number of characters needed!");
    } else {
      alert("Credentials have met our requirements");

      if (insertUser()){
        alert("Addition was successful")
        window.location.href = "/pages/buying.html"
      } else {
        alert("Addition was not successful")
      }

    }

  } else {
    alert("There is an issue with connecting to the server, so we can not sign you up ATM!");
  }

}



// add the user on the page to the postgresql server
async function insertUser(){

  let body = {}
  body.u_id = u_idTextBox.value;
  body.bill_info = bill_infoTextBox.value;
  body.ship_info = ship_infoTextBox.value;

  let result;

  try {
    result = await fetch ("http://localhost:3000/insertUser", {method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify(body)})

    return result.success

  } catch (e){
    return false
  }


}







// end of program
