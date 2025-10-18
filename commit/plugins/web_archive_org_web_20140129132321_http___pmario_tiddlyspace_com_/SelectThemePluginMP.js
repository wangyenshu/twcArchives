/***
|Name:|SelectThemePluginMP|
|Description:|Lets you easily switch theme and palette|
|Version:|1.0.1 ($Rev: 3646 $) MP 03 (2011.06.26)|
|Date:|$Date: 2008-02-27 02:34:38 +1000 (Wed, 27 Feb 2008) $|
|OriginalSource:|http://mptw.tiddlyspot.com/#SelectThemePlugin|
|OriginalAuthor:|Simon Baird <simon.baird@gmail.com>|
|License:|http://mptw.tiddlyspot.com/#TheBSDLicense|
|Author:|Mario Pietsch|

!Notes
* Borrows largely from ThemeSwitcherPlugin by Martin Budden http://www.martinswiki.com/#ThemeSwitcherPlugin
* Theme is cookie based. But set a default by setting config.options.txtTheme in MptwConfigPlugin (for example)
* Palette is not cookie based. It actually overwrites your ColorPalette tiddler when you select a palette, so beware. 

*MP Added the label to applyTheme macro.
*Made selectPalette tiddlySpace ready. 

!Usage
* {{{<<selectTheme>>}}} makes a dropdown selector
* {{{<<selectPalette>>}}} makes a dropdown selector
* {{{<<applyTheme>>}}} applies the current tiddler as a theme
* {{{<<applyPalette>>}}} applies the current tiddler as a palette
* {{{<<applyTheme TiddlerName>>}}} applies TiddlerName as a theme
* {{{<<applyPalette TiddlerName>>}}} applies TiddlerName as a palette

* {{{<<applyTheme TiddlerName label>>}}} applies TiddlerName as a theme and uses costumized button label
* {{{<<applyTheme {{tiddler.title}} label>>}}} applies actual tiddler as a theme and uses costumized button label
***/
//{{{

config.macros.selectTheme = {
	label: {
      		selectTheme:"select theme",
      		selectPalette:"select palette"
	},
	prompt: {
		selectTheme:"Select the current theme",
		selectPalette:"Select the current palette"
	},
	tags: {
		selectTheme:'systemTheme',
		selectPalette:'systemPalette'
	}
};

config.macros.selectTheme.handler = function(place,macroName)
{
	var btn = createTiddlyButton(place,this.label[macroName],this.prompt[macroName],this.onClick);
	// want to handle palettes and themes with same code. use mode attribute to distinguish
	btn.setAttribute('mode',macroName);
};

config.macros.selectTheme.onClick = function(ev)
{
	var e = ev ? ev : window.event;
	var popup = Popup.create(this);
	var mode = this.getAttribute('mode');
	var tiddlers = store.getTaggedTiddlers(config.macros.selectTheme.tags[mode]);
	// for default
	if (mode == "selectPalette") {
		var btn = createTiddlyButton(createTiddlyElement(popup,'li'),"(default)","default color palette",config.macros.selectTheme.onClickTheme);
		btn.setAttribute('theme',"(default)");
		btn.setAttribute('mode',mode);
	}
	for(var i=0; i<tiddlers.length; i++) {
		var t = tiddlers[i].title;
		var name = store.getTiddlerSlice(t,'Name');
		var desc = store.getTiddlerSlice(t,'Description');
		var btn = createTiddlyButton(createTiddlyElement(popup,'li'), name?name:t, desc?desc:config.macros.selectTheme.label['mode'], config.macros.selectTheme.onClickTheme);
		btn.setAttribute('theme',t);
		btn.setAttribute('mode',mode);
	}
	Popup.show();
	return stopEvent(e);
};

config.macros.selectTheme.onClickTheme = function(ev)
{
	var mode = this.getAttribute('mode');
	var theme = this.getAttribute('theme');
	if (mode == 'selectTheme')
		story.switchTheme(theme);
	else // selectPalette
		config.macros.selectTheme.updatePalette(theme);
	return false;
};

config.macros.selectTheme.updatePalette = function(title)
{
	var tiddlyspace = config.extensions.tiddlyspace;
	var co = config.options;

	if (title != "") {
		if (!tiddlyspace && (title != "(default)")) {
			store.deleteTiddler("ColorPalette");
			store.saveTiddler("ColorPalette","ColorPalette",store.getTiddlerText(title),
				config.options.txtUserName,undefined,"");
		}
		else if (tiddlyspace && (title != "(default)")) {
			var tiddler = store.getTiddler('ColorPalette');
			var bag = tiddler.fields["server.bag"];
			var cs = tiddlyspace.currentSpace.name;
			
			if ( (bag != cs+"_private") && (bag != cs+"_public") ) {
				tiddler.fields["server.workspace"] = (co.chkPrivateMode) ? "bags/%0_private".format([cs]) : "bags/%0_public".format([cs]);
				// remove all tags eg: "excludeLists, ..Search "
				tiddler.tags = [];
			}

			tiddler.fields["server.page.revision"] = "false";		// hacky 

			delete tiddler.fields["server.permissions"];
			delete tiddler.fields["server.title"];
			delete tiddler.fields["server.etag"];

			store.saveTiddler("ColorPalette","ColorPalette", store.getTiddlerText(title),
				config.options.txtUserName,undefined,tiddler.tags, tiddler.fields);
		}
		
		refreshAll();
		if(config.options.chkAutoSave) {
			saveChanges(true);
		}
	} // if (title != "")
};

config.macros.applyTheme = {
	label: "apply",
	prompt: "apply this theme or palette: " // i'm lazy
};

config.macros.applyTheme.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
	var label = params[1] ? params[1] : this.label;
	var useTiddler = params[0] ? params[0] : tiddler.title;
	var btn = createTiddlyButton(place,label,this.prompt+useTiddler,config.macros.selectTheme.onClickTheme);
	btn.setAttribute('theme',useTiddler);
	btn.setAttribute('mode',macroName=="applyTheme"?"selectTheme":"selectPalette"); // a bit untidy here
}

config.macros.selectPalette = config.macros.selectTheme;
config.macros.applyPalette = config.macros.applyTheme;

config.macros.refreshAll = { handler: function(place,macroName,params,wikifier,paramString,tiddler) {
	createTiddlyButton(place,"refresh","refresh layout and styles",function() { refreshAll(); });
}};

//}}}