	
function onClickOpenClose(e) {

var title=story.findContainingTiddler(place).id.substr(7);

story.closeTiddler(title);
}
config.macros["openClose"] = {label: "CloseTiddler", prompt: "Close this tiddler", title: "CloseTiddler"};
config.macros.openClose.handler = function(place) {
createTiddlyButton(place,this.label,this.prompt,onClickOpenClose);
}