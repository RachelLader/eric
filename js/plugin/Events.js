$(document).bind("EmoEngineConnected",function(event,userId){
	console.log('connected')
})

$(document).bind("EmoStateUpdated",function(event,userId,es){
	$(Excitement).text('Excitement: '+es.AffectivGetExcitementShortTermScore())
	$(Frustration).text('Frustration: ' + es.AffectivGetFrustrationScore())
	$(Engagement).text('Engagement: ' + es.AffectivGetEngagementBoredomScore())
	var getTime = es.GetTimeFromStart()
	var wireSignal = es.GetWirelessSignalStatus()
})

