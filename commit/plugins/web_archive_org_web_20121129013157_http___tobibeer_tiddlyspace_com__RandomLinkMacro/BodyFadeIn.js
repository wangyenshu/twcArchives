/***
A quick way to make your whole TiddlyWiki fade in on startup.
***/
//{{{
jQuery('#contentWrapper').hide();
setTimeout((function(){jQuery('#contentWrapper').fadeIn(1000);}),2000);
//}}}