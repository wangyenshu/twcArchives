//{{{
version.extensions.ExtensionsPlugin = {
    major: 0, minor: 2, revision: 0,
    date: new Date(2006, 3, 3), 
    type: 'macro',
    source: "http://www.math.ist.utl.pt/~psoares/addons.html#ExtensionsPlugin"
};

config.macros.ExtensionsPlugin = {};

config.macros.ExtensionsPlugin.options = {
 dateFormat: "0DD/0MM/YYYY"
}

config.macros.ExtensionsPlugin.handler= function(place,macroName,params,wikifier,paramString,tiddler) {
 var plugin;
 var table = "|!Status|!Extension|!Type|!Version|!Date|!Source|!Docs|!Update|h\n";

 if (params.length>0) {
  var tiddlers = new Array();
  for (var i=0; i<params.length; i++) {
   var temp = store.getTaggedTiddlers(params[i], "title");
   for(var j=0; j<temp.length; j++){
    if(tiddlers.indexOf(temp[j].title)==-1) tiddlers.push(temp[j].title);
   }
  }
  tiddlers.sort();
  for (var i=0; i<tiddlers.length; i++) {
   plugin = config.macros.ExtensionsPlugin.getInfo(tiddlers[i]);
   table += "| [x("+plugin.name+":systemConfig)] |[[" + plugin.name+ "]]|"+ plugin.type +"| "+ plugin.version + "|"+ plugin.date + "|" + plugin.source + "|"+ plugin.docs +"||\n";
  }
 } else{
  for (var key in version.extensions) { 
   plugin = config.macros.ExtensionsPlugin.getInfo(key);
   table += "||" + plugin.name+ "|"+ plugin.type +"| "+ plugin.version + "|"+ plugin.date + "|" + plugin.source + "|"+ plugin.docs +"||\n";
  }
 }
 wikify(table, place);
}

config.macros.ExtensionsPlugin.getInfo = function(tiddler) {
  var plugin = {name: tiddler, type: '', version: '', date: '', source: '', docs: ''};
  if(version.extensions[plugin.name]){
   plugin.version = version.extensions[plugin.name].major + "." +version.extensions[plugin.name].minor + "." + version.extensions[plugin.name].revision;
   if(version.extensions[plugin.name].source){
    plugin.source="[[source|"+ version.extensions[plugin.name].source +"]]";
   }
   if(version.extensions[plugin.name].docs){
    plugin.docs="[[docs|"+ version.extensions[plugin.name].docs +"]]";
   }
   if(version.extensions[plugin.name].type){
    plugin.type=version.extensions[plugin.name].type;
   }
   if(version.extensions[plugin.name].date){
    plugin.date=version.extensions[plugin.name].date.formatString(config.macros.ExtensionsPlugin.options.dateFormat) ;
   }
 }
 return plugin;
}
//}}}