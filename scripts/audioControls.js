// JavaScript Document
var hasCC = false;
function getFlashMovie(movieName) { 
	if (window.document[movieName]) {	//IE
		return window.document[movieName];
	}
	if (navigator.appName.indexOf("Microsoft Internet") == -1) { 	//Not IE
		if (document.embeds && document.embeds[movieName]) {	//Firefox, Opera, etc.
      		return document.embeds[movieName]; 
  		} else {	//
    		return document.getElementById(movieName);
		}
  	}
}  

function pause(FlashID) {
	getFlashMovie(FlashID).StopPlay();
}

function play(FlashID) {
	getFlashMovie(FlashID).Play();
}

function replay(FlashID) {
	getFlashMovie(FlashID).StopPlay();
	getFlashMovie(FlashID).Rewind();
	getFlashMovie(FlashID).Play();
}

function stop(FlashID) {
	getFlashMovie(FlashID).StopPlay();
	getFlashMovie(FlashID).Rewind();
}

// Enable/Disable audio and Show/Hide buttons
function toggleAudio() {
	if (parent.audioOn) {
	    if (flashID == "narration") pause("narration");
		else if (flashID == "animation") getFlashMovie("animation").muteAudio();
		//showAudioOffButton();
		$("#audio").removeClass("on");
		parent.audioOn = false;
	} else {
        if (flashID == "narration") play("narration");
		else if (flashID == "animation") getFlashMovie("animation").muteAudio();
		//showAudioOnButton();
		$("#audio").addClass("on");
		parent.audioOn = true;
    }
    return false;
}

function toggleCC() {
    if (flashID != "") {
        if (parent.ccOn) {
            $("#cc").removeClass("on");
            parent.ccOn = false;
        } else {
            $("#cc").addClass("on");
            parent.ccOn = true;
        }
    } else {
        $("#cc").addClass("disabled");
    }
    return false;
}

function checkFlash() {
    //Flash includes audio, video, and animation. This function needs to be called when page loads.
    if ( document.narration ) {
        if ($("#audio").hasClass("disabled")) $("#audio").removeClass("disabled");
        if (parent.audioOn == true) {
		    $("#audio").addClass("on");
		    play("narration");
		} else {
		    $("#audio").removeClass("on");
		    stop("narration");	
		}
    } else {
        $("#audio").addClass("disabled");
    }
	if (hasCC) {
        if ($("#cc").hasClass("disabled")) $("#cc").removeClass("disabled");
	} else {
        $("#cc").addClass("disabled");
	}
}