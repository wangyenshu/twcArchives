/***
|''Name:''|TableSortingPlugin|
|''Description:''|Dynamically sort tables by clicking on column headers|
|''Author:''|Saq Imtiaz ( lewcid@gmail.com )|
|''Source:''|http://tw.lewcid.org/#TableSortingPlugin|
|''Code Repository:''|http://tw.lewcid.org/svn/plugins|
|''Version:''|2.03|
|''Date:''|24-09-2010|
|''License:''|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]]|
|''~CoreVersion:''|2.2.3|
@@color:red;Mod by Tobias Beer! Refactored the refresh handler to allow triggering a refresh in other macros without refreshing the tiddler!@@
***/
//{{{
config.tableSorting = {
	
	darrow: "\u2193",
	uarrow: "\u2191",
	
	getText : function (o) {
		var p = o.cells[SORT_INDEX];
		return p.innerText || p.textContent || '';
	},

	sortTable : function (o,rev) {
		SORT_INDEX = o.getAttribute("index");
		var c = config.tableSorting;
		var T = findRelated(o.parentNode,"TABLE");
		if(T.tBodies[0].rows.length<=1) 
			return;
		var itm = "";
		var i = 0;
		while (itm == "" && i < T.tBodies[0].rows.length) {
			itm = c.getText(T.tBodies[0].rows[i]).trim();
			i++;
		}
		if (itm == "") 
			return; 	
		var r = [];
		var S = o.getElementsByTagName("span")[0];		
		c.fn = c.sortAlpha; 
		if(!isNaN(Date.parse(itm)))
			c.fn = c.sortDate; 
		else if(itm.match(/^[$|£|€|\+|\-]{0,1}\d*\.{0,1}\d+$/)) 
			c.fn = c.sortNumber; 
		else if(itm.match(/^\d*\.{0,1}\d+[K|M|G]{0,1}b$/)) 
			c.fn = c.sortFile; 
		for(i=0; i<T.tBodies[0].rows.length; i++) {
			 r[i]=T.tBodies[0].rows[i]; 
		} 
		r.sort(c.reSort);
		if(S.firstChild.nodeValue==c.darrow || rev) {
			r.reverse();
			S.firstChild.nodeValue=c.uarrow;
		} 
		else 
			S.firstChild.nodeValue=c.darrow;
		var thead = T.getElementsByTagName('thead')[0]; 
		var headers = thead.rows[thead.rows.length-1].cells;
		for(var k=0; k<headers.length; k++) {
			if(!hasClass(headers[k],"nosort"))
				addClass(headers[k].getElementsByTagName("span")[0],"hidden");
		}
		removeClass(S,"hidden");
		for(i=0; i<r.length; i++) { 
			T.tBodies[0].appendChild(r[i]);
			c.stripe(r[i],i);
			for(var j=0; j<r[i].cells.length;j++){
				removeClass(r[i].cells[j],"sortedCol");
			}
			addClass(r[i].cells[SORT_INDEX],"sortedCol");
		}
	},

	stripe : function (e,i){
		var cl = ["oddRow","evenRow"];
		i&1? cl.reverse() : cl;
		removeClass(e,cl[1]);
		addClass(e,cl[0]);
	},

	sortNumber : function(v) {
		var x = parseFloat(this.getText(v).replace(/[^0-9.-]/g,''));
		return isNaN(x)? 0: x;
	},

	sortDate : function(v) {
		return Date.parse(this.getText(v));
	},

	sortAlpha : function(v) {
		return this.getText(v).toLowerCase();
	},

	sortFile : function(v) { 		
		var j, q = config.messages.sizeTemplates, s = this.getText(v);
		for (var i=0; i<q.length; i++) {
			if ((j = s.toLowerCase().indexOf(q[i].template.replace("%0\u00a0","").toLowerCase())) != -1)
				return q[i].unit * s.substr(0,j);
		}
		return parseFloat(s);
	},
	
	reSort : function(a,b){
		var c = config.tableSorting;
		var aa = c.fn(a);
		var bb = c.fn(b);
		return ((aa==bb)? 0 : ((aa<bb)? -1:1));
	},
	
	refresh : function(elem){
		var ts = elem.getElementsByTagName("TABLE");
		var c = config.tableSorting;
		for(var i=0;i<ts.length;i++){
			if(hasClass(ts[i],"sortable")){
				var x = null, rev, table = ts[i], thead = table.getElementsByTagName('thead')[0], headers = thead.rows[thead.rows.length-1].cells;
				for (var j=0; j<headers.length; j++){
					var h = headers[j];
					if (hasClass(h,"nosort"))
						continue;
					h.setAttribute("index",j);
					h.onclick = function(){c.sortTable(this); return false;};
					h.ondblclick = stopEvent;
					if(h.getElementsByTagName("span").length == 0)
						createTiddlyElement(h,"span",null,"hidden",c.uarrow); 
					if(x===null && hasClass(h,"autosort")) { 
						x = j;
						rev = hasClass(h,"reverse");
					}
				}
				if(x)
					c.sortTable(headers[x],rev);		
			}
		}
	}
};

Story.prototype.tSort_refreshTiddler = Story.prototype.refreshTiddler;
Story.prototype.refreshTiddler = function(title,template,force,customFields,defaultText){
	var elem = this.tSort_refreshTiddler.apply(this,arguments);
	if(elem)config.tableSorting.refresh(elem);
	return elem; 
};

setStylesheet("table.sortable span.hidden {visibility:hidden;}\n"+
	"table.sortable thead {cursor:pointer;}\n"+
	"table.sortable .nosort {cursor:default;}\n"+
	"table.sortable td.sortedCol {background:#ffc;}","TableSortingPluginStyles");

function stopEvent(e){
	var ev = e? e : window.event;
	ev.cancelBubble = true;
	if (ev.stopPropagation) ev.stopPropagation();
	return false;	
}

config.macros.nosort={
	handler : function(place){addClass(place,"nosort");}
}

config.macros.autosort={
	handler : function(place,m,p,w,pS){addClass(place,"autosort"+" "+pS);}
}
//}}}