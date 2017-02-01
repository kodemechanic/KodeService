function createUser() {
  var xhttp = new XMLHttpRequest();

  var data = "";

  data = 
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      parseSignup(this);
    }
  };
  xhttp.open("POST", "/user", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}

function myFunction(response) {
  alert(response);
}
