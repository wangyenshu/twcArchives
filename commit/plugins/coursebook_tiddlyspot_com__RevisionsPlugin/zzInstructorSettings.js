/***
! Make tiddler macro report an error if tiddler not found

Useful when debugging coursebook.

The zzInstructorSettings tiddler isn't exported to the student book, so missing tiddlers in the studentbook are just left blank,
but with this tiddler present they look like:

<<tiddler MissingTiddler>>

which should be somewhat attention grabbing 8-).
***/

//{{{
// monkey patched version
// display large red text indicating missing tiddler. Include link to tidder w/ reference. Also if tiddler w/ link is a part tiddler, reference
// the real tiddler not the part. Check to see if tidder is defined so that it doesn't cause an error with the TiddlerNotePlugin.
var newcode = 'if (params[0] && tiddler && !(store.getTiddlerText(params[0]) || store.isShadowTiddler(params[0]))) return wikify("@@background:red;font-size: 200%;Error in [["+tiddler.title.replace(new RegExp("/[^/]+$"), "")+"]]: <nowiki><<tiddler [[</nowiki>"+params[0]+"<nowiki>]]>></nowiki> not found@@",place);';

var code=config.macros.tiddler.handler.toString();
var pos=code.indexOf('{');
code = code.substr(0,pos+1)+newcode+code.substr(pos+1);
eval('config.macros.tiddler.handler='+code);

//}}}
