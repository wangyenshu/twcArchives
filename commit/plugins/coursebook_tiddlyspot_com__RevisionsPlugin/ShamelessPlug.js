/***
! Notify the user that this is a partial coursebook and tell them how to get the full coursebook

If they find this and say 'magic words', they may get a full course book anyway as part of an e a s t e r   e g g   h u n t.
***/
//{{{
config.views.wikified.defaultText="The tiddler '%0' is not included in this coursebook sample. To receive the full coursebook, you can sign up for the S2 tutorial on Sunday November 1 at LISA 2009: http://www.usenix.org/events/lisa09/registration/"; 
config.messages.undefinedTiddlerToolTip="Click to get information on getting the missing '%0' tiddler";
//}}}

/***
! Have the tiddler macro insert a shameless plug
***/
//{{{
// if local style changes aren't present in the tiddler macro, then we are not in the instructor book
// so we want to swap in the new code.

var newcode = 'if (params[0] && tiddler && !(store.getTiddlerText(params[0]) || store.isShadowTiddler(params[0]))) return  wikify("@@font-weight: bold;color: red;***The content of tiddler [["+params[0].replace(new RegExp("/[^/]+$"), "")+"]] is not available. Click the link to find out why.***@@",place);';

var code=config.macros.tiddler.handler.toString();
if ( code.indexOf('"@@' == -1) ) {
var pos=code.indexOf('{');
code = code.substr(0,pos+1)+newcode+code.substr(pos+1);
eval('config.macros.tiddler.handler='+code);
}
//}}}