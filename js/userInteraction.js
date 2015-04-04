window.onload = function(e){ 
    document.getElementById('userSays').contentEditable = true;
    initEliza()
    userTxtObj = $('#userSays')
    userTxtObj.focus();
    userTxtObj.keydown(function(e){
    	if(e.which == 13) {
    		e.preventDefault();
        	console.log(e.currentTarget.textContent);
        	elizaStep(e.currentTarget.textContent)
        	userTxtObj.fadeOut(400,function(){
        		userTxtObj.text("")
        		userTxtObj.focus()
        		userTxtObj.fadeIn(0)
        	})
        }
    })
}

var eliza
function initEliza(){
	eliza = new ElizaBot();
}

function elizaStep(str,target) {
	console.log('step')
	var userinput = str
	var rpl = eliza.transform(userinput);
	console.log(rpl)
	ericTxtObj = $('#ericSays')
	ericTxtObj.fadeOut(400,function(){
		ericTxtObj.text(rpl)
		ericTxtObj.focus()
		ericTxtObj.fadeIn(400)
        sayEricLine(rpl)
	})
	//elizaLines.push(usr);
	//elizaLines.push(rpl);
}
var TTS_URL = "https://t2s.p.mashape.com/speech/"
function sayEricLine(str){
    var context = new AudioContext();
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