
let password = "hello"

function enter(){
  let bossTextBox = document.getElementById("input");
  if (bossTextBox.value == password){
    window.location.href = "/pages/book_And_Report.html";
  }
}
