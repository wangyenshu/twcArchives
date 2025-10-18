/***
{{fr{
<<tiddler PolyGlotPluginDoc_fr>>}}}{{hide{
----
}}}{{en{
<<tiddler PolyGlotPluginDoc_en>>}}}
!Options
{{fr{<<option chkPolyglotHijackUrl>> ajouter le paramètre de langues aux url générées par {{{permaview}}} et {{{permalink}}} }}}{{en{<<option chkPolyglotHijackUrl>>add language parameter to {{{permalink}}} and {{{permaview}}} generated urls}}}

!Code
***/
// //{{en{ Version Info}}}{{fr{ Informations de version}}}
//{{{
version.extensions.PolyGlotPlugin = { major: 1, minor: 1, revision: 4, date: new Date(2007,31,1),
 source: "http://yann.perrin.googlepages.com/twkd.html#PolyGlotPlugin"
};
//}}}
// //{{en{ Default Settings}}}{{fr{ Paramètres par défaut}}}
//{{{
config.macros.polyglot = {
defaultlang:"fr",
languages:["fr","en"],
pluginTranslationTag:"linguo",
tooltip:"version ",
notfound:" isn't one of the supported languages",
hijackurl:false,
hidewhenactive:"hide"
};
//}}}
// //{{en{ generating CSS hiding unselected languages}}}{{fr{ génération des styles qui cachent les langages non séléctionnées}}}
//{{{
polyglotCSS = function(lang){
   var langs=[];
   langs=langs.concat(config.macros.polyglot.languages);
   var current=langs.find(lang);
   if (current != null)
      langs.splice(current,1);
   var hlangs="." + langs.join(",.");
   var css=hlangs + ",." + config.macros.polyglot.hidewhenactive + "{display:none;}";
   return css;
};
//}}}
// //{{en{ tag and process translation tiddlers}}}{{fr{ indexation et utilisation des tiddlers de traduction}}}
//{{{
polyglotTag = function(tiddler,lang){
   if (!tiddler.isTagged(lang) && tiddler.isTagged('systemConfig'))
      {
       var current = tiddler.tags.find('systemConfig');
       tiddler.tags.splice(current,1);
       tiddler.assign(tiddler.title,tiddler.text,tiddler.modifier,tiddler.modified,tiddler.tags,tiddler.created);
      };
   if (tiddler.isTagged(lang) && !tiddler.isTagged('systemConfig'))
      {
       var tags=tiddler.getTags();
       tags += " systemConfig";
       window.eval(tiddler.text);
       tiddler.assign(tiddler.title,tiddler.text,tiddler.modifier,tiddler.modified,tags,tiddler.created);
      };
};
//}}}
// //{{en{ Apply necessary changes}}}{{fr{ Application des changements}}}
//{{{
polyglotApply = function(lang) {
   config.options.txtPolyglotLang=lang;
   saveOptionCookie("txtPolyglotLang");
   setStylesheet(polyglotCSS(lang),'language');
   var tiddlers = store.getTaggedTiddlers(config.macros.polyglot.pluginTranslationTag);
   for (var i=0;i<tiddlers.length;i++)
      polyglotTag(tiddlers[i],lang);
};
//}}}
// //{{en{ Hijacking restart() to load selected language tiddlers on startup}}}{{fr{ Détournement de restart() afin de charger les tiddlers de traduction au démarrage}}}
//{{{
window.polyglotRestart=window.restart;
window.restart = function() {
if (config.options.txtPolyglotLang==undefined)
   config.options.txtPolyglotLang=config.macros.polyglot.defaultlang;
if (config.options.chkPolyglotHijackUrl==undefined)
   config.options.chkPolyglotHijackUrl = config.macros.polyglot.hijackurl;
var lang = config.options.txtPolyglotLang;
polyglotApply(lang);
polyglotRestart();
store.notifyAll();
};
//}}}
// //{{en{ refresh displayed tiddlers}}}{{fr{ rafraichit les tiddlers affichés}}}
//{{{
refreshStory = function() {
story.forEachTiddler(function(title,element){
   if(element.getAttribute("dirty") != "true")
      story.refreshTiddler(title,null,true);
   });
};
//}}}
// //{{en{ polyglot macro handler}}}{{fr{ affichage de la macro polyglot}}}
//{{{
window.polyglotOnClickHandler=function(e) {
   var btn=this;
   var lang=btn.getAttribute("id");
   polyglotApply(lang);
   store.notifyAll();
   refreshStory();
};
config.macros.polyglot.handler = function (place,macroName,params,wikifier,paramString,tiddler) {
var langs = config.macros.polyglot.languages;
for (var i=0;i<langs.length;i++)
   {
   if (i>0)
      wikify(" | ",place);
   createTiddlyButton(place,langs[i],this.tooltip+langs[i],polyglotOnClickHandler,"polyglotBtn",langs[i]);
   };
};
//}}}
// //{{en{paramifier}}}{{fr{gestion des paramètres passés par l'url}}}
//{{{
config.paramifiers.lang = {
 onconfig: function(v){
   var current=config.macros.polyglot.languages.find(v);
   if (current !=null)
      {
      config.options.txtPolyglotLang=v;
      saveOptionCookie("txtPolyglotLang");
      }
   else
      alert(v + config.macros.polyglot.notfound);
}
}
//}}}
// //{{en{hijacking permaview and permalink to add the lang: param to the url}}}{{fr{detournement de permaview et permalink afin d'ajouter le parametre de langue à l'url}}}
//{{{
var addLangToUrl = function() {
var param = "lang:"+config.options.txtPolyglotLang;
if (config.options.chkPolyglotHijackUrl)
   window.location.hash = window.location.hash+" "+param;
}
window.PolyGlotPermaLink=config.commands.permalink.handler;
config.commands.permalink.handler = function(event,src,title) {
PolyGlotPermaLink(event,src,title);
addLangToUrl();
}
window.PolyGlotPermaView=config.macros.permaview.onClick;
config.macros.permaview.onClick=function(e) {
PolyGlotPermaView(e);
addLangToUrl();
return false;
}
//}}}
// //{{en{shadow links to documentation}}}{{fr{liens vers la documentation si elle n'est pas présente}}}
//{{{
config.shadowTiddlers.PolyGlotPluginDoc_en = "Documentation for this plugin is available [[here|" + version.extensions.PolyGlotPlugin.source +"Doc_en]]";
config.shadowTiddlers.PolyGlotPluginDoc_fr = "La documentation de ce plugin est disponible [[ici|" + version.extensions.PolyGlotPlugin.source +"Doc_fr]]";
//}}}