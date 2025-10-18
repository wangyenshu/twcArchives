/***
|!''Name:''|!''N.E.W.S.''|
|''Description:''|this plugin ensure that tiddlers with the chosen tag that were modified since your last visit are displayed.<<br>>it also lists the tiddlers it manages as new or archived in a new shadowTiddler called [[NewsManager]]|
|''Version:''|0.2.0|
|''Date:''|22/03/2007|
|''Source:''|http://yann.perrin.googlepages.com/twkd.html#N.E.W.S.|
|''Author:''|[[Yann Perrin|YannPerrin]]|
|''License:''|[[BSD open source license]]|
|''~CoreVersion:''|2.x|
|''Browser:''|Firefox 1.0.4+; Firefox 1.5; InternetExplorer 6.0|
***/
//{{{
if (!window.TWkd) window.TWkd={context:{}};
if (!TWkd.News) TWkd.News = {
	tag:"Blog",
	noNews:"No news since your last visit",
	noArchive:"Nothing archived yet",
	restart:window.restart,
	choose:function () {
			var defaultTiddlers = store.getTaggedTiddlers(this.tag,"modified");
			var actualNews = [];
			var archived =[]
			for (var t in defaultTiddlers) {
				var modifDate = defaultTiddlers[t].modified ? defaultTiddlers[t].modified.convertToYYYYMMDDHHMM() : "0";
				if (defaultTiddlers[t].title != undefined)  {
					if  ((config.options.txtLastVisit==undefined)||(config.options.txtLastVisit < modifDate)) {
						actualNews.push("[["+defaultTiddlers[t].title+"]]");
					} else {
						archived.push("[["+defaultTiddlers[t].title+"]]");
					}
				}
			}
			config.shadowTiddlers.News = actualNews.length ? actualNews.reverse().join("\n") : this.noNews;
			config.shadowTiddlers.Archive = archived.length ? archived.reverse().join("\n") : this.noArchive;
			config.shadowTiddlers.NewsManager ="!News <<newJournal 'DD MMM YYYY' label:'+' tag:'"+this.tag+"'>>\n<<tiddler News>>\n!Archive\n<<tiddler Archive>>";
		},
	display:function () {
			invokeParamifier(params,"onstart");
			if(window.story.isEmpty()) {
				if ((config.options.txtLastVisit != undefined)&&(config.shadowTiddlers.News!=this.noNews)) {
					var defaultParams = config.shadowTiddlers.News.parseParams("open",null,false);
					invokeParamifier(defaultParams,"onstart");
				}
			}
			store.notifyAll();
		},
	update:function () {
			config.options.txtLastVisit = new Date().convertToYYYYMMDDHHMM();
			saveOptionCookie("txtLastVisit");
		}
}
window.restart = function() {
	TWkd.News.choose();
	TWkd.News.display();
	TWkd.News.update();
	TWkd.News.restart();
}
//}}}