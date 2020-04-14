
const password = "hello"

function enter(){
  let bossTextBox = document.getElementById("input");
  // if the text typed in matches what we have as the password then the user we know you are the boss
  if (bossTextBox.value == password){
    window.location.href = "/pages/book_And_Report.html";
  }
}
