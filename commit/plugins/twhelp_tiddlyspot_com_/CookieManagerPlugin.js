/***
|Name|CookieManagerPlugin|
|Source|http://www.TiddlyTools.com/#CookieManagerPlugin|
|Version|2.0.0|
|Author|Eric Shulman - ELS Design Studios|
|License|http://www.TiddlyTools.com/#LegalStatements <<br>>and [[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|~CoreVersion|2.1|
|Type|plugin|
|Requires||
|Overrides||
|Description|review/add/delete option cookies and save current option values to CookieJar tiddler for 'sticky' settings|

!!!!!Usage
<<<
View/set/delete your current TiddlyWiki option/cookie values, as well as "bake cookies", which automatically generates the contents of a [[CookieJar]] tiddler for all current cookie-based options.   You can then edit the [[CookieJar]] to remove any lines that set unwanted fixed-value options (so that the normal cookie-based values will still be used for those options).  The code contained in the [[CookieJar]] is wrapped in a conditional so that the fixed-value options are only applied for a specific username.  That way, when you publish or share your document with others, YOUR fixed-value options are not applied, and the normal cookie-based options will still be used for everyone else.

Also, each time you "bake cookies", they are *appended* to the [[CookieJar]], so that any previous values are not automatically discarded, but are instead simply *overridden* by the newer values. After you bake a new batch of cookies, you should edit the [[CookieJar]] to remove any "stale cookies" or merge the old and new options into a single block to simplify code (for readability as well as saving a little tiddler storage space). 
<<<
!!!!!Examples
<<<

{{{<<cookieManager>>}}}
{{smallform{<<cookieManager>>}}}
<<<
!!!!!Installation
<<<
import (or copy/paste) the following tiddlers into your document:
CookieManagerPlugin
<<<
!!!!!Revision History
<<<
''2007.08.02 [2.0.0]'' converted from inline script
''2007.04.29 [1.0.0]'' initial release
<<<
!!!!!Credits
<<<
This feature was developed by Eric L Shulman / ELS Design Studios

<<<
!!!!!Code
***/
//{{{
version.extensions.cookieManager= {major: 2, minor: 0, revision: 0, date: new Date(2007,8,2)};

config.macros.cookieManager = {
	handler: function(place,macroName,params,wikifier,paramString,tiddler) {
		var span=createTiddlyElement(place,"span");
		span.innerHTML=this.html;
		this.setCookieEditorList(span.firstChild.list); 
	},
	html: '<form style="display:inline;margin:0;padding:0" onsubmit="return false"><!--\
		--><select style="width:99%" name="list" \
			onchange="this.form.val.value=this.value.length?config.options[this.value]:\'\';"><!--\
		--></select><br>\
		<input type="text" style="width:98%;margin:0;" name="val" title="enter an option value"><br>\
		<input type="button" style="width:33%;margin:0;" value="get" title="refresh list" \
			onclick="config.macros.cookieManager.setCookieEditorList(this.form.list);"><!--\
		--><input type="button" style="width:33%;margin:0;" value="set" title="save cookie value" \
			onclick="var opt=this.form.list.value; var v=this.form.val.value; \
				config.options[opt]=opt.substr(0,3)==\'txt\'?v:(v.toLowerCase()==\'true\'); \
				saveOptionCookie(opt);config.macros.cookieManager.setCookieEditorList(this.form.list);"><!--\
		--><input type="button" style="width:33%;margin:0;" value="del" title="remove cookie" \
			onclick="var ex=new Date(); ex.setTime(ex.getTime()-1000); \
				document.cookie=this.form.list.value+\'=novalue; path=/; expires=\'+ex.toGMTString(); \
				config.macros.cookieManager.setCookieEditorList(this.form.list);"><br>\
		<input type="button" style="width:50%;margin:0;" value="bake cookies" \
			title="save current cookie-based option values into the CookieJar tiddler" \
			onclick="return config.macros.cookieManager.bakeCookies(this,false)"><!--\
		--><input type="button" style="width:50%;margin:0;" value="bake all options" \
			title="save ALL option values (including NON-COOKIE values) into the CookieJar tiddler" \
			onclick="return config.macros.cookieManager.bakeCookies(this,true)"><!--\
		--></form>\
	',
	bakeCookies: function(here,all) {
		var title='CookieJar';
		var tid=store.getTiddler(title);
		var who=config.options.txtUserName;
		var when=new Date();
		var tags=['systemConfig'];
		if (all) { 
			var opts=new Array();
			for (var i in config.options) if (i.substr(0,3)=='chk'||i.substr(0,3)=='txt') opts.push(i);
			opts.sort();
		}
		else var opts=this.getCookieList();
		var text=tid?tid.text:'';
		text+='\n// '+opts.length+(all?' options':' cookies')+' saved ';
		text+=when.formatString('on DDD, MMM DDth YYYY at 0hh:0mm:0ss');
		text+=' by '+who+'//\n';
		text+='//^^(edit/remove username check and/or individual option settings as desired)^^//\n';
		text+='//{{{\n';
		text+='if (config.options.txtUserName=="'+who+'") {\n';
		for (i=0; i<opts.length; i++) {
			if (opts[i].substr(0,3)=='chk')
				text+='\tconfig.options.'+opts[i]+'='+config.options[opts[i]]+';\n';
			if (opts[i].substr(0,3)=='txt')
				text+='\tconfig.options.'+opts[i]+'="'+config.options[opts[i]]+'";\n';
		}
		text+='}\n//}}}\n';
		store.saveTiddler(title,title,text,who,when,tags,tid?tid.fields:null);
		story.displayTiddler(story.findContainingTiddler(this),title);
		story.refreshTiddler(title,null,true);
		displayMessage(opts.length+(all?' options':' cookies')+' have been saved in '+title+'.  Please review all stored settings.');
		return false;
	},
	getCookieList: function() {
		var cookies = { };
		if (document.cookie != "") {
			var p = document.cookie.split("; ");
			for (var i=0; i < p.length; i++) {
				var pos=p[i].indexOf("=");
				if (pos==-1) cookies[p[i]]="";
				else cookies[p[i].substr(0,pos)]=unescape(p[i].slice(pos+1));
			}
		}
		var opt=new Array(); for (var i in config.options) if (cookies[i]) opt.push(i); opt.sort();
		return opt;
	},
	setCookieEditorList: function(list) {
		var opt=this.getCookieList();
		var sel=list.selectedIndex;
		while (list.options.length > 1) { list.options[1]=null; } // clear list (except for header item)
		list.options[0]=new Option("There are "+opt.length+" cookies...","",false,false);
		if (!opt.length) { list.form.val.value=""; return; } // no cookies
		var c=1;
		for(var i=0; i<opt.length; i++) {
			var txt="";
			if  (opt[i].substr(0,3)=="chk")
				txt+="["+(config.options[opt[i]]?"x":"_")+"] ";
			txt+=opt[i];
			list.options[c++]=new Option(txt,opt[i],false,false);
		}
		list.selectedIndex=sel>0?sel:0;
		list.form.val.value=sel>0?config.options[list.options[sel].value]:"";
	}
}
//}}}