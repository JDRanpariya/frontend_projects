
  var n = Math.random();
  n = Math.floor(n*6+1);


  var n1 = Math.random();
  n1 = Math.floor(n1*6+1);


if(n>n1){
  winner="Player 1 Won";
}
else if(n<n1){
  winner="Player 2 Won";
}
else {
  winner="Draw";
}



document.querySelector("h1").innerHTML = (winner);




document.querySelector(".img1").src = "images/dice" + n +".png";
document.querySelector(".img2").src = "images/dice" + n1 +".png";
