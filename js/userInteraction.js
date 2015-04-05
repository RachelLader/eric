var engine,es;
$(document).ready(function(e){ 
    console.log('yo')
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

    //EMOENGINE
    engine = EmoEngine.instance()
    console.log(engine)
    es = new EmoState();

    engine.Connect()
    updateEmoEngine()
});

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

var lastResponseIndex = -1
function updateEmoEngine()
{   
    engine.ProcessEvents(500);
    console.log("Frustration: "+es.AffectivGetFrustrationScore())
    console.log("Excitement: "+es.AffectivGetExcitementShortTermScore())
    console.log("Valence: "+ es.AffectivGetValenceScore())
    if (es.AffectivGetFrustrationScore() > .8 && lastResponseIndex !== 0){
        console.log("Frustration: "+es.AffectivGetFrustrationScore())
        triggerResponse_Frustrated()
        lastResponseIndex = 0
    }
    else if (es.AffectivGetExcitementShortTermScore() > .8 && lastResponseIndex !== 1){
        console.log("Excitement: "+es.AffectivGetExcitementShortTermScore())
        triggerResponse_Excited()
        lastResponseIndex = 1
    }
    else if (es.AffectivGetValenceScore() > .7 && lastResponseIndex !== 2){
        console.log("Valence: "+ es.AffectivGetValenceScore())
        triggerResponse_Happy()
        lastResponseIndex = 2
    }
    setTimeout("updateEmoEngine()",50);
}

function triggerResponse_Excited(){
    eliza.reset()
    ericTxtObj = $('#ericSays')
    ericTxtObj.fadeOut(400,function(){
        ericTxtObj.text("I've noticed you're excited.  Care to share? (:")
        ericTxtObj.focus()
        ericTxtObj.fadeIn(400)
        sayEricLine("I've noticed you're excited.  Care to share?")
    })
}

function triggerResponse_Frustrated(){
        eliza.reset()
        ericTxtObj = $('#ericSays')
        ericTxtObj.fadeOut(400,function(){
            ericTxtObj.text("I've noticed you're frustrated.  Want to talk about it? :/")
            ericTxtObj.focus()
            ericTxtObj.fadeIn(400)
            sayEricLine("I've noticed you're frustrated. What to talk about it?")
        })
}

function triggerResponse_Happy(){
        eliza.reset()
        ericTxtObj = $('#ericSays')
        ericTxtObj.fadeOut(400,function(){
            ericTxtObj.text("I've noticed you're feeling good.  Give me the deets (: (:")
            ericTxtObj.focus()
            ericTxtObj.fadeIn(400)
            sayEricLine("I've noticed you're feeling good. Give me the deets!")
        })
}




