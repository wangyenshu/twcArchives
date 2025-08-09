/***
|Synopsis|Customized startup code|
|Author|[[Conal Elliott|http://conal.net]]|
|Date|2006-12-31|
|Version|1.0|
|LoadDependencies|[[conditional WikiLink formatter]]|
!Description
I neutralized this plugin.  (Note the <<tag systemConfig_not>> tag.)  Use the friendlier DisableWikiLinksPlugin instead.

I end up ~TwiddlePrefixing a lot of CamelCase words that I'm not intending as WikiLinks.   This tweaking of the "wikiLink" formatter gives one the option to render such words as links only if the tiddler exists.  That policy would save me a lot of twiddling but still let me conveniently refer to system tiddlers.
 
''Note'': This tweak does not change any behavior.  It only introduces //option// of the new formatting.  To activate it, put the following code into a systemConfig tiddler:
{{{
findObject(config.formatters,'name',"wikiLink").linkIfUnknown = false;
}}}
I would like to see this tweak become part of the TiddlyWiki core, leaving activation to users.
!Code
***/
//{{{
// findObj: Find object in an array of the object whose given field has the
// given value.  Otherwise null;
function findObject(array,field,value) {
    for (var i=0;i<array.length;i++)
	if (array[i][field] == value)
	    return array[i];
    return null;
};
 
// Find and replace the wikiLink formatter.  See "linkIfUnknown" field intro & use below.
{
    var wl = findObject(config.formatters,'name',"wikiLink");
    if (wl == null) {
	alert("Oops -- didn't find wikiLink formatter.");
    } else {
        wl.linkIfUnknown = true;  // new flag, used in new handler
 	wl.handler = function (w)
	{
		var preRegExp = new RegExp(config.textPrimitives.anyLetter,"mg");
		var preMatch = null;
		if(w.matchStart > 0)
			{
			preRegExp.lastIndex = w.matchStart-1;
			preMatch = preRegExp.exec(w.source);
			}
		if(preMatch && preMatch.index == w.matchStart-1)
			w.outputText(w.output,w.matchStart,w.nextMatch);
		else if(w.matchText.substr(0,1) == config.textPrimitives.unWikiLink)
			w.outputText(w.output,w.matchStart + 1,w.nextMatch);
		else {
			var link = createTiddlyLink(w.output,w.matchText,false);
			if(!store.tiddlerExists(w.matchText)) {
				if(store.isShadowTiddler(w.matchText))
					addClass(link,"shadow");
				else if(this.linkIfUnknown)
                                	addClass(link,"missing");
                                else {
                                        // treat as text after all
                                        w.outputText(w.output,w.matchStart,w.nextMatch);
                                        return;
                                }
                        } else {
				removeClass(link,"shadow");
				removeClass(link,"missing");
                        }
			w.outputText(link,w.matchStart,w.nextMatch);
		}
	}
    }
}
//}}}
