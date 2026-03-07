/***
''Selective copy of www.tiddlytools.com CoreTweaks renamed so that updates don't pull in the full CoreTweaks.''
***/
/***
http://trac.tiddlywiki.org/ticket/683 - OPEN
The web standard 'type=file' input control that has been used as a local path/file picker for TiddlyWiki no longer works as expected in FireFox3, which has, for security reasons, limited javascript access to this control so that *no* local filesystem path information can be revealed, even when it is intentional and necessary, as it is with TiddlyWiki.  This tweak provides alternative HTML source that patches the backstage import panel.  It replaces the 'type=file' input control with a text+button combination of controls that invokes a system-native secure 'file-chooser' dialog box to provide TiddlyWiki with access to a complete path+filename so that TW functions properly locate user-selected local files.
>Note: ''This tweak also requires http://trac.tiddlywiki.org/ticket/604 - cross-platform askForFilename()''

DISABLED: rolled into tw 2.5.2
***/
/***
//{{{
if (window.Components {
	var fixhtml='<input name="txtBrowse" style="width:30em"><input type="button" value="..."'
		+' onClick="window.browseForFilename(this.previousSibling,true)">';
	var cmi=config.macros.importTiddlers;
	cmi.step1Html=cmi.step1Html.replace(/<input type='file' size=50 name='txtBrowse'>/,fixhtml);
}

merge(config.messages,{selectFile:'Please enter or select a file'}); // ready for I18N translation

window.browseForFilename=function(target,mustExist) { // note: both params are optional
	var msg=config.messages.selectFile;
	if (target && target.title) msg=target.title; // use target field tooltip (if any) as dialog prompt text
	// get local path for current document
	var path=getLocalPath(document.location.href);
	var p=path.lastIndexOf('/'); if (p==-1) p=path.lastIndexOf('\\'); // Unix or Windows
	if (p!=-1) path=path.substr(0,p+1); // remove filename, leave trailing slash
	var file=''
	var result=window.askForFilename(msg,path,file,mustExist); // requires #604
	if (target && result.length) // set target field and trigger handling
		{ target.value=result; target.onchange(); }
	return result; 
}
//}}}
***/
/***
!!!604 cross-platform askForFilename()
***/
/***
http://trac.tiddlywiki.org/ticket/604 - OPEN
invokes a system-native secure 'file-chooser' dialog box to provide TiddlyWiki with access to a complete path+filename so that TW functions properly locate user-selected local files.

DISABLED: rolled into tw 2.5.2
***/
/***
//{{{
window.askForFilename=function(msg,path,file,mustExist) {
	var r = window.mozAskForFilename(msg,path,file,mustExist);
	if(r===null || r===false)
		r = window.ieAskForFilename(msg,path,file,mustExist);
	if(r===null || r===false)
		r = window.javaAskForFilename(msg,path,file,mustExist);
	if(r===null || r===false)
		r = prompt(msg,path+file);
	return r||'';
}

window.mozAskForFilename=function(msg,path,file,mustExist) {
	if(!window.Components) return false;
	try {
		netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
		var nsIFilePicker = window.Components.interfaces.nsIFilePicker;
		var picker = Components.classes['@mozilla.org/filepicker;1'].createInstance(nsIFilePicker);
		picker.init(window, msg, mustExist?nsIFilePicker.modeOpen:nsIFilePicker.modeSave);
		var thispath = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
		thispath.initWithPath(path);
		picker.displayDirectory=thispath;
		picker.defaultExtension='html';
		picker.defaultString=file;
		picker.appendFilters(nsIFilePicker.filterAll|nsIFilePicker.filterText|nsIFilePicker.filterHTML);
		if (picker.show()!=nsIFilePicker.returnCancel)
			var result=picker.file.persistentDescriptor;
	}
	catch(ex) { displayMessage(ex.toString()); }
	return result;
}

window.ieAskForFilename=function(msg,path,file,mustExist) {
	if(!config.browser.isIE) return false;
	try {
		var s = new ActiveXObject('UserAccounts.CommonDialog');
		s.Filter='All files|*.*|Text files|*.txt|HTML files|*.htm;*.html|';
		s.FilterIndex=3; // default to HTML files;
		s.InitialDir=path;
		s.FileName=file;
		return s.showOpen()?s.FileName:'';
	}
	catch(ex) { displayMessage(ex.toString()); }
	return result;
}

window.javaAskForFilename=function(msg,path,file,mustExist) {
	if(!document.applets['TiddlySaver']) return false;
	// TBD: implement java-based askFile(...) function
	try { return document.applets['TiddlySaver'].askFile(msg,path,file,mustExist); } 
	catch(ex) { displayMessage(ex.toString()); }
}
//}}}
***/

/***
!!!529 IE fixup - case-sensitive element lookup of tiddler elements
***/
/***
http://trac.tiddlywiki.org/ticket/529 - OPEN
This tweak hijacks the standard browser function, document.getElementById(), to work-around the case-INsensitivity error in Internet Explorer (all versions up to and including IE7) //''Note: This tweak is only applied when using IE, and only for lookups of rendered tiddler elements within the containing 'tiddlerDisplay' element.''//
***/
//{{{
if (config.browser.isIE) {
document.coreTweaks_coreGetElementById=document.getElementById;
document.getElementById=function(id) {
	var e=document.coreTweaks_coreGetElementById(id);
	if (!e || !e.parentNode || e.parentNode.id!='tiddlerDisplay') return e;
	for (var i=0; i<e.parentNode.childNodes.length; i++)
		if (id==e.parentNode.childNodes[i].id) return e.parentNode.childNodes[i];
	return null;
};
}
//}}}

/***
!!! 1134 handle references to tiddler sections in shadows
***/
/***
http://trac.tiddlywiki.org/ticket/1134
This tweak REPLACES and extends {{{store.getTiddlerText()}}} so it can return sections defined in shadow tiddlers.  It also permits use of leading whitespace in section headings.
***/
//{{{
TiddlyWiki.prototype.getTiddlerText = function(title,defaultText)
{
	if(!title) return defaultText;
	var parts = title.split(config.textPrimitives.sectionSeparator);
	var title = parts[0];
	var section = parts[1];
	var parts = title.split(config.textPrimitives.sliceSeparator);
	var title = parts[0];
	var slice = parts[1]?this.getTiddlerSlice(title,parts[1]):null;
	if(slice) return slice;
	var tiddler = this.fetchTiddler(title);
	var text = defaultText;
	if(this.isShadowTiddler(title))
		text = this.getShadowTiddlerText(title);
	if(tiddler)
		text = tiddler.text;
	if(!section) return text;
	var re = new RegExp("(^!{1,6}[ \t]*" + section.escapeRegExp() + "[ \t]*\n)","mg");
	re.lastIndex = 0;
	var match = re.exec(text);
	if(match) {
		var t = text.substr(match.index+match[1].length);
		var re2 = /^!/mg;
		re2.lastIndex = 0;
		match = re2.exec(t); //# search for the next heading
		if(match)
			t = t.substr(0,match.index-1);//# don't include final \n
		return t;
	}
	return defaultText;
};
//}}}

/***
!!!608/609/610 toolbars - toggles, separators and transclusion
***/
/***
http://trac.tiddlywiki.org/ticket/608 - OPEN (more/less toggle)
http://trac.tiddlywiki.org/ticket/609 - OPEN (separators)
http://trac.tiddlywiki.org/ticket/610 - OPEN (wikify tiddler/slice/section content)

This combination tweak extends the """<<toolbar>>""" macro to add use of '<' to insert a 'less' menu command (the opposite of '>' == 'more'), as well as use of '*' to insert linebreaks and "!" to insert a vertical line separator between toolbar items.  In addition, this tweak add the ability to use references to tiddlernames, slices, or sections and render their content inline within the toolbar, allowing easy creation of new toolbar commands using TW content (such as macros, links, inline scripts, etc.)

To produce a one-line style, with "less" at the end, use
| ViewToolbar| foo bar baz > yabba dabba doo < |
or to use a two-line style with more/less toggle:
| ViewToolbar| foo bar baz > < * yabba dabba doo |
***/
//{{{
merge(config.macros.toolbar,{
	moreLabel: 'more\u25BC',
	morePrompt: 'Show additional commands',
	lessLabel: '\u25C4less',
	lessPrompt: 'Hide additional commands',
	separator: '|'
});
config.macros.toolbar.onClickMore = function(ev) {
	var e = this.nextSibling;
	e.style.display = 'inline'; // show menu
	this.style.display = 'none'; // hide button
	return false;
};
config.macros.toolbar.onClickLess = function(ev) {
	var e = this.parentNode;
	var m = e.previousSibling;
	e.style.display = 'none'; // hide menu
	m.style.display = 'inline'; // show button
	return false;
};
config.macros.toolbar.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
	for(var t=0; t<params.length; t++) {
		var c = params[t];
		switch(c) {
			case '!':  // ELS - SEPARATOR (added)
				createTiddlyText(place,this.separator);
				break;
			case '*':  // ELS - LINEBREAK (added)
				createTiddlyElement(place,'BR');
				break;
			case '<': // ELS - LESS COMMAND (added)
				var btn = createTiddlyButton(place,
					this.lessLabel,this.lessPrompt,config.macros.toolbar.onClickLess,'moreCommand');
				break;
			case '>':
				var btn = createTiddlyButton(place,
					this.moreLabel,this.morePrompt,config.macros.toolbar.onClickMore,'moreCommand');
				var e = createTiddlyElement(place,'span',null,'moreCommand');
				e.style.display = 'none';
				place = e;
				break;
			default:
				var theClass = '';
				switch(c.substr(0,1)) {
					case '+':
						theClass = 'defaultCommand';
						c = c.substr(1);
						break;
					case '-':
						theClass = 'cancelCommand';
						c = c.substr(1);
						break;
				}
				if(c in config.commands)

					this.createCommand(place,c,tiddler,theClass);
				else { // ELS - WIKIFY TIDDLER/SLICE/SECTION (added)
					if (c.substr(0,1)=='~') c=c.substr(1); // ignore leading ~
					var txt=store.getTiddlerText(c);
					if (txt) {
						// trim any leading/trailing newlines
						txt=txt.replace(/^\n*/,'').replace(/\n*$/,'');
						// trim PRE format wrapper if any
						txt=txt.replace(/^\{\{\{\n/,'').replace(/\n\}\}\}$/,'');
						// render content into toolbar
						wikify(txt,createTiddlyElement(place,'span'),null,tiddler);
					}
				} // ELS - end WIKIFY CONTENT
				break;
		}
	}
};
//}}}
