// JavaScript Document
function toSCmenu(iBranch, lastBranchPg) {
	if (lastBranchPg) {
		if (parent.scMenuItems.indexOf(iBranch) == -1) {
			parent.scMenuItems += iBranch + "";
		}
	} 
	window.location.href = "03003.html";
}

