
var server_uIDs = [];

// this is where we connect to the database
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

  // checks if we actually got something useable from the server
  if (server_uIDs.length > 1 || server_uIDs != undefined){
    // we good here as it checks out
    return true
  } else {
    return false
  }

}



// based on the u_id the user inputted we check to see if it is part of the currently existing
// u_ids on the database
async function checkUserIn(){

  var present = false

  if (connectToDB() && Array.isArray(server_uIDs)){
    let u_idTextBox = document.getElementById("u_id");

    for (id of server_uIDs){
      if (u_idTextBox.value === id.u_id){
        present = true
        console.log("In for loop u_idTextBox.value " + u_idTextBox.value + " && u_id " + id.u_id);
        break
      }
    }

    // does the u_id exist on the server
    if (present == false){
      alert(" Accoriding to our servers this u_id does not exist!\n\n You are welcome to try again");
      return; // get out of the function
    }

    console.log("checkUserIn after the if statement for the POST");

    // we make the POST request to server
    await fetch("http://localhost:3000/userId", {
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify({
        u_id:u_idTextBox.value
      })
    })

    window.location.href = "/pages/buying.html"

  } else {
    alert("Sign In Page says \"Couldn't connect to server\"");
  }

}








// end of program
