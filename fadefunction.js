window.onload = function() {
  $("#landingbutton").click(function(e) {
  e.preventDefault()
  $("#landingpage").fadeOut(1600);
  $("#userSays").focus();
  });
}
