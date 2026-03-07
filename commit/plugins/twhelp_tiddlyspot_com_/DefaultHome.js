function onClickDefaultHome(e) {
story.closeAllTiddlers();
config.options.txtDefaultTiddlers = "";
saveOptionCookie('txtDefaultTiddlers');
var start = store.getTiddlerText("DefaultTiddlers");
if(start)
story.displayTiddlers(null,start.readBracketedList());
}
config.macros["defaultHome"] = {label: "Home", prompt: "Close all open tiddlers show the home page", title: "Home"};
config.macros.defaultHome.handler = function(place) {
createTiddlyButton(place,this.label,this.prompt,onClickDefaultHome);
}

