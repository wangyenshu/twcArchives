config.macros.TagTable = {
  handler: function(place) {
    var tagsCount = {};
    var tiddlers = store.getTiddlers();
    for(var i=0; i < tiddlers.length; i++){
      var tags = tiddlers[i].tags;
      for(var j=0; j < tags.length; j++){
        var tag = tags[j];
        tagsCount[tag] = tagsCount[tag] ? tagsCount[tag] + 1 : 1;
      }
    }
    var line1 = [];
    var line2 = []; 
    for(var i in tagsCount){
      line1.push(i);
      line2.push(tagsCount[i]);
    }
    var wikiText = "|%0|\n|%1|".format([line1.join("|"),line2.join("|")]);
    wikify(wikiText, place);
  }
}