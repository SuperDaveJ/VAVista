var flashID = "";
var blnDYK = false;
var blnLastPage = false;
var enableNext = true;
var enableBack = true;

function exitConfirm(){
	if (confirm("Do you wish to exit the course?")==true) {
		parent.exitCourse();
	}
}

function goNext() {
	parent.gotoPage(nextURL);
	return false;
}

function goBack() {
	parent.gotoPage(backURL);
	return false;
}

function toSCmenu(iBranch, lastBranchPg) {
	//used in module 3
	if (lastBranchPg) {
		if (parent.scMenuItems.indexOf(iBranch) == -1) {
			parent.scMenuItems += iBranch + "";
		}
	} 
	window.location.href = "03003.html";
}

/*********************** Open Popup Functions **********************************/
function openWinCentered(myUrl, myTitle, myWidth, myHeight, scrollbar, resize ) {
	// open the window
	positionTop = (screen.height - myHeight)/2 - 25;
	positionLeft = (screen.width - myWidth)/2 - 5;
	newWin = window.open (myUrl,myTitle,"toolbar=no,location=no,width="+myWidth+",height="+myHeight+",menubar=no,resizable="+resize+",status=no,scrollbars="+scrollbar+",top="+positionTop+",left="+positionLeft+"");
	if (window.focus) newWin.focus();
}

function openHelp() {
	window.open("../references/Help.pdf", "Help");
	return false;
}

function openGlossary() {
	window.open("../glossary.pdf", "Glossary");
	return false;
}

function openResources() {
	openWinCentered("../resources.html", "Resources", 800, 580, "no", "yes");
	return false;
}

function show_cc() {
	filename = parent.getPage() + "_cc.html";
	openWinCentered( filename, "AudioTranscript", 500, 450, "no", "yes" );
    return false;
}

function showDYK() {
	filename = parent.getPage() + "_dyk.html";
	openWinCentered( filename, "DidYouKnow", 500, 450, "no", "yes" );
	/*
	$("#whiteout").addClass("visible");
	$("#didyouknow_box").addClass("visible");
	$("#closeDYK").on("click", closeDYK);
	$("#closeDYK").focus();
	*/
    return false;
}

function closeDYK() {
	//not used
	$("#whiteout").removeClass("visible");
	$("#didyouknow_box").removeClass("visible");
	$("#closeDYK").off("click", closeDYK);
}

function showPopup(iTerm) {
    //filename = parent.getPage() + "_pop.html?popterm=" + iTerm;
    openWinCentered(iTerm, "popupText", 550, 450, "no");
    //return false;
}
/*********************** End of Open Popup Functions **********************************/

$(document).ready(function () {
    $("#next").on("click", goNext);
    $("#back").on("click", goBack);
    $("#audio").on("click", toggleAudio);
    $("#cc").on("click", show_cc);
    $("#resources").on("click", openResources);
    $("#didyouknow").on("click", showDYK);
    $("#menu").on("click", parent.toMenu);
    $("#exit").on("click", exitConfirm);
    checkFlash();
    if (!enableNext) $("#next").addClass("disabled");
    if (!enableBack) $("#back").addClass("disabled");
	if (!blnDYK) $("#didyouknow").addClass("disabled");
});