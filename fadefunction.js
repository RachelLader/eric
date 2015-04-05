window.onload = function() {
  $("#landingbutton").click(function(e) {
  e.preventDefault()
  $("#landingpage").fadeOut(1600);
  $("#userSays").focus();
  sayEricLine("How can I help you?");
  });
}


var TTS_URL = "https://t2s.p.mashape.com/speech/"
var context = new AudioContext();
function sayEricLine(str){
    var req = new XMLHttpRequest();
    console.log(str)
    console.log(encodeURI(str))
    var args = "lang=en&text="+encodeURI(str)
    req.responseType = "arraybuffer"
    req.onload = function (){
        context.decodeAudioData(req.response, function (buffer){
            var playSound = context.createBufferSource();
            playSound.buffer = buffer;
            playSound.connect(context.destination);
            playSound.start(0);
        });
    }
    req.open('POST',TTS_URL, true)
    req.setRequestHeader("X-Mashape-Key","5AmPnlra6YmshRKeIg9EhGMiqLPJp14k775jsnsDgfiv5yb2u4")
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    req.send(args)
}   