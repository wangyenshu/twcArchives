function onClickMyGroup(e) {
story.closeAllTiddlers();
config.options.txtMyDefaultTiddlers = "";
saveOptionCookie('txtMyDefaultTiddlers');
var start = store.getTiddlerText("MyDefaultTiddlers");
if(start)
story.displayTiddlers(null,start.readBracketedList());
}
config.macros["MyGroup"] = {label: "MyGroup", prompt: "Close all open tiddlers and show the MyGroup of tiddlers", title: "MyGroup"};
config.macros.MyGroup.handler = function(place) {
createTiddlyButton(place,this.label,this.prompt,onClickMyGroup);
}