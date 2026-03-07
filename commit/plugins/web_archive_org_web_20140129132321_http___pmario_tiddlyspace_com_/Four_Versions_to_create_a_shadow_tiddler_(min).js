/***
|Uglify|http://marijnhaverbeke.nl/uglifyjs|
|Old version:|3344 bytes |
|New version:|759 bytes |
|Saved:|2585 (result is 22.6% of original) |
* A minified version at least should have some license info.

***/
//{{{
(function(a){var b="fancyStyleSheet",c=[".myClass {","\tfont-size: 0.9em;\t/* Some info for the user, why the developer did it that way */","}"];config.shadowTiddlers[b]="/*{{{*/\n"+c.join("\n")+"\n/*}}}*/",store.addNotification(b,refreshStyles);var d=[".myClass {","\tfont-size: 0.9em;","}"];config.shadowTiddlers.myFancyStyleSheet="/*{{{*/\n"+d.join("\n")+"\n/*}}}*/",store.addNotification("myFancyStyleSheet",refreshStyles),config.shadowTiddlers.myFancyStyleSheet_="/*{{{*/\n"+[".myClass {","\tfont-size: 0.9em;","}"].join("\n")+"\n/*}}}*/",store.addNotification("myFancyStyleSheet_",refreshStyles),config.shadowTiddlers.StyleSheetMyPlugin="/*{{{*/\n.myClass {\n\tfont-size: 0.9em;\n}\n/*}}}*/",store.addNotification("StyleSheetMyPlugin",refreshStyles)})()
//}}}