// JavaScript Document
//This file is for VA-VistA course.  It's AICC compliant.

/********* initialize variables needed *************/
var nModules = 5;
var modStatus = "";				//suspend data
for (var i=0; i<nModules; ++i) modStatus += "0";
var aiccSID = "";					//session ID
var aiccURL = "";					//LMS URL
var courseStatus = "incomplete";	//course status
var bookmark = "";					//lesson_location
var userScore = "";					//user score
var inLMS = false;					//will be determined dynamically
var exitStatus = false;
var startPage = "vistaMenu.html";
var newLine = "\r\n";

/***************** Navigation Functions ******************************/
function gotoPage(pgURL) {
	if (contentFrame.blnLastPage) {
		updateModuleStatus('2');
	} 
	contentFrame.location.href = pgURL;
}

function toMenu() {
	if (contentFrame.blnLastPage) 
		updateModuleStatus('2');
	contentFrame.location.href = "../vistaMenu.html";
}

function getPage() {
	//return current page file name in lower case without file extension.
	arrTemp = new Array();
	arrTemp2 = new Array();
	arrTemp = contentFrame.location.href.split("/");
	arrTemp2 = arrTemp[arrTemp.length-1].split("?");
	var strTemp = arrTemp2[0];
	var intTemp = strTemp.indexOf(".htm");
	strTemp = strTemp.substring(0,intTemp);
	return strTemp.toLowerCase();
}

function getModuleNumber() {
	//Returns an integer as modID
	if ( getPage().indexOf("menu") >= 0 ) {
		return 0;
	} else {
		arrTemp = new Array();
		arrTemp = contentFrame.location.href.split("/");
		var strTemp = arrTemp[arrTemp.length-2];
		return parseInt(strTemp.substring(6) );
	}
}

function getModuleStatus(iMod) {	//returns an integer 0, 1, or 2.
	var intTemp;
	intTemp = parseInt(modStatus.substr(iMod-1,1));
	if ( (intTemp < 0) || (intTemp > 2) ) return 0;
	else return intTemp;
}

function updateModuleStatus(cStatus) {
	var iMod = getModuleNumber();
	if (iMod > 0)
		modStatus = modStatus.substr(0,iMod-1) + cStatus + modStatus.substr(iMod);
	if (cStatus == "2") {
		checkCourseStatus();
		setTimeout("saveAICCdata()",1000);
	}
}

function checkCourseStatus() {
	if ( (courseStatus == "completed") || (courseStatus == "passed") ) return;
	var modCompleted = 0;
	for (var i=1; i<=nModules; i++) {
		if (getModuleStatus(i) === 2) {
			modCompleted += 1;
		}
	}
	if (modCompleted === nModules) courseStatus = "completed";
	else courseStatus = "incomplete";
}

/**************************** AICC Functions *********************************/
function startCourse() {
	var strINI = window.location.search? unescape(window.location.search.substring(1)) : null;
	if( strINI != null ) {
		iPos = strINI.indexOf( '=' );
		while( iPos >= 0 ) {
			var name = strINI.substring(0, iPos ).toLowerCase();
			var nextPos = strINI.indexOf( '&' );
			var val = "";
		
			if( nextPos > iPos )
			  	val = strINI.substring( iPos+1, nextPos );
			else
			  	val = strINI.substring( iPos+1 );
		
			val = unescape( val );
			
			if( name == "aicc_sid" ) {
				aiccSID = val;
			} else if( name == "aicc_url" ) {
				aiccURL = val;
			}
			if( nextPos >= 0 ) {
			  	strINI = strINI.substring( nextPos+1 );
			  	iPos = strINI.indexOf( '=' );
			} else iPos = -1;
		}
		if ( (aiccSID != "") && (aiccURL != "") ) {
			inLMS = true;
			getAICCdata();
		}
		if ( (bookmark != "") && (bookmark != null) && (bookmark != undefined) ) {
			if (confirm("Do you wish to resume where you left?")==true) contentFrame.location.href = bookmark;
			else contentFrame.location.href = startPage;
		} else {
			contentFrame.location.href = startPage;
		}
	} else {
		contentFrame.location.href = startPage;
	}
}

function getXHRHandle() {
	var xhr = null;  // the XMLHTTPRequest object
	try {
		// modern browsers: Opera 8.0+, Firefox, Safari, etc.
		xhr = new XMLHttpRequest();
	} catch (e) {
		// Internet Explorer Browsers
		try {
			xhr = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
				// Something went wrong
				alert("Your browser does not support XMLHTTPRequest!");
				return null;
			}
		}
	}
	return xhr;
}

var strDataFromLMS = "";
function getAICCdata() {
  if ( inLMS == true ) {
	xhr = getXHRHandle();
	if (xhr) {
		xhr.onreadystatechange = function() {/* do nothing */};
		xhr.open("POST", aiccURL, false);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
		var strParams = "command=GetParam&session_id=" + aiccSID + "&version=4.0";
		xhr.send(strParams);
    	if( xhr.status != 200 ) { 
      		alert( "HTTPRequest Error: " + xhr.statusText );
      		return;
    	}
		strDataFromLMS = xhr.responseText;
		if ( (strDataFromLMS != "") && (strDataFromLMS != undefined) ) {
			parseAICCdata();
		}
	}
  }
}

function parseAICCdata() {
	strDataFromLMS = strDataFromLMS.toLowerCase().replace(/[\r\n]/gi, "`").replace(/`+/g, "\u20AC").replace(/^\u20AC|\u20AC$/g, "");
  
	 arrPositions = new Array();
	 arrSections = new Array();
	 i = 0;
	 iStart = 0;
	 var strTemp = "";
	 while ( strDataFromLMS.indexOf( "[", iStart ) != -1 ) {
		 arrPositions[i] = strDataFromLMS.indexOf("[", iStart);
		 iStart = arrPositions[i] + 5;
		 ++i;
	 }
	 for (var i=0; i<arrPositions.length-1; ++i) {
		 arrSections[i] = strDataFromLMS.substring(arrPositions[i], arrPositions[i+1]);
	 }
	arrSections[i] = strDataFromLMS.substring(arrPositions[i]);
  
	for (var i=0; i<arrSections.length; ++i) {
		//only need info from 2 sections
	   if ( arrSections[i].indexOf("[core]") >= 0 ) {
		   //[CORE] section
		  arrPairs = new Array();
		  iStart = arrSections[0].indexOf("[core]");
		  strTemp = arrSections[i].substring(iStart+6);
		  strTemp = strTemp.replace(/^\u20AC|\u20AC$/g, "");
		  arrPairs = strTemp.split("\u20AC");
		
		  courseStatus = bookmark = "";
		  for (var j=0; j<arrPairs.length; ++j) {
			arrTemp = new Array();
			if (arrPairs[j].indexOf("lesson_status") >= 0) {
				arrTemp = arrPairs[j].split("=");
				courseStatus = arrTemp[1];
			} else if (arrPairs[j].indexOf("lesson_location") >= 0) {
				arrTemp = arrPairs[j].split("=");
				bookmark = arrTemp[1];
			} else if (arrPairs[j].indexOf("score") >= 0) {
				arrTemp = arrPairs[j].split("=");
				if ( (arrTemp[1] != "") && (arrTemp[1] != null) && (arrTemp[1] != undefined) ) {
				  userScore = parseInt(arrTemp[1]);
				}
			}
		  }
	   } 
	   if ( arrSections[i].indexOf("[core_lesson]") >= 0 ) {
		   //[CORE_LESSON] section
		  iStart = arrSections[i].indexOf("[core_lesson]");
		  spData = arrSections[i].substring(iStart+13);
		  spData = spData.replace(/^\u20AC|\u20AC$/g, "");
		  if ( (spData != "") && (spData != null) && (spData != undefined) ) {
			  modStatus = spData;
		  }
	   }
	}
}

function saveAICCdata() {
	if ( inLMS ) {
		bookmark = "";
		if ( (getModuleNumber() > 0) && (getModuleNumber() <= nModules) ) {
			bookmark = "module" + getModuleNumber() + "/" + getPage() + ".html";
		} else {
			bookmark = getPage() + ".html";
		}
		if (contentFrame.blnLastPage) {
			bookmark = "vistaMenu.html";
		}
		var strParams = "command=PutParam&version=4.0&session_id=" + aiccSID + "&aicc_data=";
		strParams += "[CORE]" + newLine + "Lesson_Status=" + courseStatus;
		strParams += newLine + "Lesson_Location=" + bookmark;
		strParams += newLine + "Score=" + userScore + newLine + "Time=" + calcTime();
		strParams += newLine + "[CORE_LESSON]" + newLine + modStatus;
		xhr = getXHRHandle();
		if (xhr) {
			xhr.onreadystatechange = function() {/* do nothing */};
			xhr.open("POST", aiccURL, false);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
			xhr.send(strParams);
			if( xhr.status != 200 ) { 
				alert( "HTTPRequest Error: " + xhr.statusText );
			}
		}
	}
}

function exitCourse() {
	checkCourseStatus();
	if (courseStatus == "completed") {
		//set a score to let LMS to change lesson_status to passed
		userScore = "100";
	}
	if ( inLMS ) {
		saveAICCdata();
		setTimeout("exitAICC()",1000);
	}
	exitStatus = true;
	setTimeout("top.close()",1000);
}

function exitAICC() {
	strParams = "command=ExitAU&version=4.0&session_id=" + aiccSID + "";
	xhr = getXHRHandle();
	if (xhr) {
		xhr.onreadystatechange = function() {/* do nothing */};
		xhr.open("POST", aiccURL, false);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
		xhr.send(strParams);
		if( xhr.status != 200 ) { 
			alert( "HTTPRequest Error: " + xhr.statusText );
		}
	}
}

function unloadCourse() {
	if (exitStatus != true) {
		exitCourse();
	}
}

/*************************** Time Function *******************************/
var dateObj1 = new Date();
var startTime1 = dateObj1.getTime();

function calcTime() {
    dateObj2 = new Date();
    endTime = dateObj2.getTime();
    totSec = Math.round((endTime - startTime1)/1000);
	if ( totSec >= 3600 ) {
    	timeHour = Math.floor(totSec/3600);
    	if (timeHour.toString().length == 1) timeHour='0'+timeHour;
		totSec = totSec - timeHour*3600;
	} else {
		timeHour = "00";
	}
    timeMin = Math.floor(totSec/60);
    if (timeMin.toString().length == 1) timeMin='0'+timeMin;
    timeSec = totSec - (timeMin * 60)
    if (timeSec.toString().length == 1) timeSec='0'+timeSec;
	
    totTime = timeHour + ":" + timeMin + ":" + timeSec
    return totTime;
}