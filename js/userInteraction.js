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
	})
	//elizaLines.push(usr);
	//elizaLines.push(rpl);
}