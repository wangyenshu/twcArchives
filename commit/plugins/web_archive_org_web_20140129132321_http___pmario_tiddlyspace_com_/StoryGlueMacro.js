/***
|''Name:''|StoryGlueMacro|
|''Description:''|Makes SelectStoryMacro and NavigationMacro work together|
|''Author:''|Mario Pietsch|
|''Source:''|http://a-pm.tiddlyspot.com|
|''Version:''|0.5.2|
|''Status:''|beta|
|''Date:''|2010.02.06|
|''Requires:''|SelectStoryMacro, NavigationMacro|
|''License:''|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]]|
|''~CoreVersion:''|2.2.2|
!!!!!Usage:
<<<
Add the macro to the ViewTemplate, specifying the tag eg:"story" and a cookie: eg:"ACTIVESTORY" to navigate between the possible stories.
Find the line: 
{{{
<div class='viewer' macro='view text wikified'></div>
}}}
''and add the following line below:'' 
{{{
<div class='viewer' macro='storyGlue story ACTIVESTORY</div>
}}}
If you are allready using "navigation" macro. Replace "navigation" macro because it is called by StoryGlueMacro to handle navigation.
Don't delete it comment it !!
<<<
!!!!!Parameter
<<<
General Format: 
{{{
<div class='viewer' macro='storyGlue storyTag COOKIENAME</div>
}}}
storyTag: The macro searches all tiddlers tagged: "storyTag"
>If the tiddler is found in one or more stories. "selectStory" macro is activated instead of "navigation" macro to switch to a new story if you want.
>If it doesn't find a matching story nothing is displayed.

COOKIENAME is last part of an txtSelectStory option cookie, that storyGlue will look at. 
>The cookie is used, to store the name of the actual story, that will be used for navigating.
>The cookie can be manipulated also by SelectStoryMacro if the same name is used. 
>Bee carefull if you use a different name. Look at my examples!
>If you don't use SelectStoryMacro you will need a little program somewhere in your init functions.
>{{{config.options.txtSelectStoryCOOKIENAME  = "yourTiddlerThatContainsAStoryAndIsTaggedWithXXXX";}}}
>Better have a look at [[zzMptwUserConfigPlugin]] 

The option: {{{<<option txtSelectStoryACTIVESTORY>>}}}: ''<<varDisplay {{config.options.txtSelectStoryACTIVESTORY}}>>''
contains the active story, that is used in [[a-pm presentation manager|http://a-pm.tiddlyspot.com]].

If you click a tiddler, which is not part of the active story, but of any tiddler tagged: "story", storyGlue will activate the SelectStoryMarcro. SelectStoryMacro will display all stories found in a different color (default: blue). If you click on of the small sqares, it will activate this story, which can be used for navigatin now. 

The SelectStoryMacro can also work stand alone. See [[SelectStoryMacro]] for more details.
<<<
!!!!!Attention
<<<
There is no limit using different cookie names. ''But be warned: If you get confused. It is not my fault :)''
If your cookie name is eg: MYSTORY the option which contains the active story will be: {{{<<option txtSelectStoryMYSTORY>>}}}
It is always: txtSelectStory + yourCookieName.
In viewTemplate call it with: 
{{{
<div class='viewer' macro='storyGlue story MYSTORY</div>
}}}
<<<
!!!!!Example:
<<<
[[Demo|Story1]]
<<<
!!!!!Revision History
<<<
*Version: 0.5.1 - 2010.01.30
**commented the displayMessage if an empty story is selected from SelectStoryMacro
<<<
***/
/*{{{*/
// 
//!BEGIN-PLUGIN-CODE
if(!version.extensions.StoryGluePlugin) { //# ensure that the plugin is only installed once
version.extensions.StoryGluePlugin = { installed: true };

if(!config.extensions) { config.extensions = {}; } //# obsolete from v2.4.2

config.macros.storyGlue= {
	defineStoryMsg: "~StoryGlue: option name is not defined!\n"+
			"Read the Documentation!\n" +
			"Check your ~ViewTemplate!\n" +
			"Check: config.options.",
	
	handler: function(place, macroName, params, wikifier, paramString, tiddler){

		if (!config.macros.navigation) 
			return false;
		if (!config.macros.selectStory) 
			return false;
		if (config.options.chkDisableStoryGlue== undefined)
			config.options.chkDisableStoryGlue= false;

		var sets = store.getTaggedTiddlers(params[0]); // get tiddlers tagged eg:'story'
		var optId = config.macros.selectStory.optPreTxt + params[1]; // get the last part of the cookie name
		var txtArray = [];
		for (var i = 0; i < sets.length; i++) {
			txtArray.push(sets[i].title);
		}
		var navIndex = txtArray.indexOf(config.options[optId]);
		if (navIndex == -1) {
			// console.log(this.defineStoryMsg+optId);
			return false; // can only be if option is undefined or different pc / cookie
		}
		var tiddlers = store.getTiddlerText(sets[navIndex].title).readBracketedList(); // read tiddlers in active story
		var tidIndex = tiddlers.indexOf(tiddler.title);
		
		// storyline ok .. use navigation macro 
		if (tidIndex != -1) {
			var p = "tiddlers:{{store.getTiddlerText('" + sets[navIndex].title + "').readBracketedList()}}";
			invokeMacro(place, 'navigation', p, wikifier, tiddler);
			return false;
		}
		if (config.options.chkDisableStoryGlue) 
			return false;

		if (this.debug) console.log('not disabled:', tiddlers);

		if (tidIndex == -1) {
			// search other stories for this tiddler.
			var text = params[1]+' '+'tiddlers: [[';
			var found = false;
			for (var i=0; i<txtArray.length; i++) {   //!!!!!!! better search needed !
				tiddlers = store.getTiddlerText(txtArray[i]).readBracketedList(); // read tiddlers in active story
				tidIndex = tiddlers.indexOf(tiddler.title);
				if (tidIndex != -1) {
					found = true;
					text = text + '"' + txtArray[i] + '" '; 
				} // if tidIndex ..	
			} // for i < txtArray.len ..
			text = text+']]';
//	 console.log( 'text: ' + text);
//	 console.log( 'found: ' + found);
//			var text = params[1]+" "+ "tiddlers: {{ var array = store.filterTiddlers('[tag[" + params[0] + 
//				"]]');var text = ''; for (var i=0; i<array.length; i++)"+
//				"{text = text + '[[' + array[i].title + ']]';};}}";		// be carefull evaluated string !!!

			if (found) invokeMacro(place, 'selectStory', text, wikifier, tiddler);
		} // handler
	} // config macro
}
} //# end of "install only once"
/*}}}*/