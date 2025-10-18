//{{{
config.shadowTiddlers["StyleSheetSvgIcons"]="/*{{{*/\n"+
	"/*replace FG with BG if you want to toggle the BackGround insted of the ForeGround */\n"+
	".showFG {\n"+
	"	opacity: 0;\n"+
	"}\n\n"+
	"svg:hover .showFG {\n"+
	"	opacity: 1;\n"+
	"}\n"+
	"/*}}}*/";
store.addNotification("StyleSheetSvgIcons",refreshStyles);
//}}}


