window.findScrollOffsetX=function(obj) {
	var x=0;
	while(obj) {
		if (obj.scrollLeft && obj.nodeName!='HTML')
			x+=obj.scrollLeft;
		obj=obj.parentNode;
	}
	return -x;
}

window.findScrollOffsetY=function(obj) {
	var y=0;
	while(obj) {
		if (obj.scrollTop && obj.nodeName!='HTML')
			y+=obj.scrollTop;
		obj=obj.parentNode;
	}
	return -y;
}

var fn=Popup.place.toString();
if (fn.indexOf('findScrollOffsetX')==-1) { // only once
	fn=fn.replace(/var\s*rootLeft\s*=/,'var rootLeft = window.findScrollOffsetX(root) +');
	fn=fn.replace(/var\s*rootTop\s*=/,'var rootTop = window.findScrollOffsetY(root) +');
	eval('Popup.place='+fn);
}

