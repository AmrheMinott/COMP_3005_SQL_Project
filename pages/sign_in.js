
var server_uIDs = [];

async function connectToDB(){

  try {
    console.log("Connected and we got the values in the array");
    var result  = await fetch("http://localhost:3000/getUIDs" , {method:"GET"})
    server_uIDs = await result.json();
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


async function checkUserIn(){


  if (connectToDB()){
    let u_idTextBox = document.getElementById("u_id");
    if (!server_uIDs.includes(u_idTextBox.value)){
      alert(" Accoriding to our servers this u_id does not exist!\n\n You are welcome to try again");
      return;
    }
    console.log("checkUserIn after the if statement for the POST");
    await fetch("http://localhost:3000/userId", {method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({u_id:u_idTextBox.value})})

    window.location.href = "/pages/buying.html"

  } else {
    alert("Couldn't connect to server actually");
  }

}






















// end of program
