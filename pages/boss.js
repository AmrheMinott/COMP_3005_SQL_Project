
let password = "hello"

function enter(){
  let bossTextBox = document.getElementById("boss_id");
  if (bossTextBox.value == password){
    window.location.href = "/pages/add_Book.html";
  }
}
