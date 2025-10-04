config.macros.ActivityTable = {
  handler: function(place) {
    var collection = {};
    var tiddlers = store.sortTiddlers(store.getTiddlers(),"modified");
    for(var i=0; i < tiddlers.length; i++){
    if(!tiddlers[i].tags.contains("excludeLists")) {
        var modified = tiddlers[i].modified;
        var id = modified.formatString("0DD/0MM");
        collection[id] = collection[id] ? collection[id] + 1 : 1;
      } 
    }
    var line1 = [];
    var line2 = []; 
    for(var i in collection){
      line1.push(i);
      line2.push(collection[i]);
    }
// only show last 10 days
    line1 = line1.slice(0, 10);
    line2 = line2.slice(0,10);
    var wikiText = "|Modified|%0|\n|Number Tiddlers|%1|".format([line1.join("|"),line2.join("|")]);
    wikify(wikiText, place);
  }
}