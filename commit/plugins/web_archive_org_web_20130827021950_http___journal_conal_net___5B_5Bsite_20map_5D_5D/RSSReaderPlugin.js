/***
|''Name:''|RSSReaderPlugin|
|''Description:''|This plugin provides a RSSReader for TiddlyWiki|
|''Version:''|0.3.0|
|''Date:''|Aug 24, 2006|
|''Source:''|http://tiddlywiki.bidix.info/#RSSReaderPlugin|
|''Documentation:''|http://tiddlywiki.bidix.info/#RSSReaderPluginDoc|
|''Author:''|BidiX (BidiX (at) bidix (dot) info)|
|''Credit:''|BramChen for RssNewsMacro|
|''License:''|[[BSD open source license|http://tiddlywiki.bidix.info/#%5B%5BBSD%20open%20source%20license%5D%5D ]]|
|''~CoreVersion:''|2.0.0|
|''Browser:''|Firefox 1.5; InternetExplorer 6.0; Safari|
|''Include:''|none|
|''Require:''|none|
***/
//{{{
version.extensions.RSSReaderPlugin = {
	major: 0, minor: 3, revision: 0,
	date: new Date("Aug 24, 2006"),
	author: "BidiX",
	credit: "BramChen for RssNewsMacro",
	source: "http://TiddlyWiki.bidix.info/#RSSReaderPlugin",
	documentation : "http://TiddlyWiki.bidix.info/#RSSReaderPluginDoc",
	author: 'BidiX (BidiX (at) bidix (dot) info',
	license: '[[BSD open source license|http://tiddlywiki.bidix.info/#%5B%5BBSD%20open%20source%20license%5D%5D]]',
	coreVersion: '2.0.0',
	browser: 'Firefox 1.5; InternetExplorer 6.0; Safari'	
};

config.macros.rssReader = {
	dateFormat: "DDD, DD MMM YYYY",
	itemStyle: "display: block;border: 1px solid black;padding: 5px;margin: 5px;", //useed  '@@'+itemStyle+itemText+'@@'
	msg:{
		permissionDenied: "Permission to read preferences was denied.",
		noRSSFeed: "No RSS Feed at this address %0",
		urlNotAccessible: " Access to %0 is not allowed"
	},
	cache: [], 	// url => request
	desc: "noDesc",
	// feedURL: "",
	place:"",
	handler: function(place,macroName,params,wikifier,paramString,tiddler){
		var desc = params[0];
		var feedURL = params[1];
		// var toFilter = (params[2] ? params[2] : false);
		var toFilter = false;
		var filterString;
		if (params[2] != undefined) {
			toFilter = true;
			if (params[2].match(/\w+/))
				filterString = params[2];
			else
				filterString = tiddler.title;
		}
		var place = createTiddlyElement(place, "div", "RSSReader");
		wikify("^^<<rssFeedUpdate "+feedURL+" [[" + tiddler.title + "]]>>^^\n",place);
		if (this.cache[feedURL]) {
			this.processResponse(this.cache[feedURL], feedURL, place, desc, toFilter, filterString);
		}
		else {
			this.asyncGet(feedURL, place, desc, toFilter, filterString);
		}
	},

	asyncGet: function (feedURL, place, desc, toFilter, filterString){
		var xmlhttp;
		try {xmlhttp=new XMLHttpRequest();}
		catch (e) {
			try {xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");}
			catch (e) {
				try {xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");}
				catch (e) { displayMessage(e.description?e.description:e.toString());}
			}
		}
		if (!xmlhttp){
			return;
		}
		if (window.netscape){
			try {
				if (document.location.protocol.indexOf("http") == -1) {
 					netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
				}
			}
			catch (e) { displayMessage(e.description?e.description:e.toString()); }
		}
		xmlhttp.onreadystatechange=function (){
			if (xmlhttp.readyState==4) {
				if (xmlhttp.status==200 || xmlhttp.status===0) {
					config.macros.rssReader.processResponse(xmlhttp, feedURL, place, desc, toFilter, filterString);
				}
				else {
					displayMessage("Problem retrieving XML data:" + xmlhttp.statusText);
				}
			}
		};
		try {
			xmlhttp.open("GET",feedURL,true);
			if (config.browser.isIE) {
				xmlhttp.send();
			}
			else {
				xmlhttp.send(null);
			}
		}
		catch (e) {
			wikify(e.toString()+this.urlNotAccessible.format([feedURL]), place);
		}
	},
	processResponse: function(xmlhttp, feedURL, place, desc, toFilter, filterString){	
		if (window.netscape){
			try {
				if (document.location.protocol.indexOf("http") == -1) {
					netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
				}
			}
			catch (e) { displayMessage(e.description?e.description:e.toString()); }
		}
		if (xmlhttp.responseXML){
			this.cache[feedURL] = xmlhttp;
			this.genRssNews(xmlhttp.responseXML, place, feedURL, desc, toFilter, filterString);
		}
		else {
			var dom = (new DOMParser()).parseFromString(xmlhttp.responseText, "text/xml"); 
			if (dom) {
				this.cache[feedURL] = xmlhttp;
				this.genRssNews(dom, place, feedURL, desc, toFilter, filterString);
			}
			else {
				wikify("<html>"+xmlhttp.responseText+"</html>", place);
				displayMessage(this.msg.noRSSFeed.format([feedURL]));
			}
		}
	},
	genRssNews: function(xml, place, feedURL, desc, toFilter, filterString){
		// Channel
		var chanelNode = xml.getElementsByTagName('channel').item(0);
		var chanelTitleElement = (chanelNode ? chanelNode.getElementsByTagName('title').item(0) : null);
		var chanelTitle = "";
		if ((chanelTitleElement) && (chanelTitleElement.firstChild)) chanelTitle = chanelTitleElement.firstChild.nodeValue;
		var chanelLinkElement = (chanelNode ? chanelNode.getElementsByTagName('link').item(0) : null);
		var chanelLink = "";
		if (chanelLinkElement) chanelLink = chanelLinkElement.firstChild.nodeValue;
		var titleTxt = "!![["+chanelTitle+"|"+chanelLink+"]]\n";
		var title = createTiddlyElement(place,"div",null,"ChanelTitle",null);
		wikify(titleTxt,title);
		// ItemList
		var itemList = xml.getElementsByTagName('item');
		var article = createTiddlyElement(place,"ul",null,null,null);
		var lastDate;
		var re;
		if (toFilter) 
			re = new RegExp(filterString.escapeRegExp());
		for (var i=0; i<itemList.length; i++){
			var titleElm = itemList[i].getElementsByTagName('title').item(0);
			var titleText = (titleElm ? titleElm.firstChild.nodeValue : '');
			if (toFilter && ! titleText.match(re)) {
				continue;
			}
			var descText = '';
			var isWikitext = false;
			var descElem = itemList[i].getElementsByTagName('wikitext').item(0);
			if (descElem){
				try{
					isWikitext = true;
					descText = "\n"+descElem.firstChild.nodeValue;}
					catch(e){}
			}
			else {
				descElem = itemList[i].getElementsByTagName('encoded').item(0);
				if (descElem){
					try{descText = descElem.firstChild.nodeValue;}
						catch(e){}
					descText = "<html>"+descText+"</html>";
				}
				else {
					descElem = itemList[i].getElementsByTagName('description').item(0);
					if (descElem){
						try{descText = descElem.firstChild.nodeValue;}
						catch(e){}
						descText = descText.replace(/<br \/>/g,'\n');
						if (desc == "asHtml")
							descText = "<html>"+descText+"</html>";
					}
				}
			}
			var linkElm = itemList[i].getElementsByTagName("link").item(0);
			var linkURL = linkElm.firstChild.nodeValue;
			var pubElm = itemList[i].getElementsByTagName('pubDate').item(0);
			var pubDate;
			if (!pubElm) {
				pubElm = itemList[i].getElementsByTagName('date').item(0); // for del.icio.us
				if (pubElm) {
					pubDate = pubElm.firstChild.nodeValue;
					pubDate = this.formatDateString(this.dateFormat, pubDate);
					}
					else {
						pubDate = '0';
					}
				}
			else {
				pubDate = (pubElm ? pubElm.firstChild.nodeValue : 0);
				pubDate = this.formatString(this.dateFormat, pubDate);
			}
			titleText = titleText.replace(/\[|\]/g,'');
			var rssText = '** '+'[[' + titleText + '|' + linkURL + ']]' + '\n' ;
			if ((desc != "noDesc") && descText){
				if (version.extensions.nestedSliders){
					rssText = rssText.replace(/\n/g,' ');
					descText = '+++[...]\n'
						+(isWikitext ? '\n<<rssFeedImportTiddler '+ feedURL + ' [['+titleText+']]>>':'')
						+'@@'+this.itemStyle+descText+'\n@@\n'
						+'===';
					}
				rssText = rssText + descText + '\n\n';
			}
			var story;
			if ((lastDate != pubDate) && ( pubDate != '0')) {
				story = createTiddlyElement(article,"li",null,"RSSItem",pubDate);
				lastDate = pubDate;
			}
			else {
				lastDate = pubDate;
			}
			story = createTiddlyElement(article,"div",null,"RSSItem",null);
			wikify(rssText,story);
		}
	},
	formatString: function(template, theDate){
		var dateString = new Date(theDate);
		template = template.replace(/hh|mm|ss/g,'');
		return dateString.formatString(template);
	},
	formatDateString: function(template, theDate){
		var dateString = new Date(theDate.substr(0,4), theDate.substr(5,2) - 1, theDate.substr(8,2)
			/*,  theDate.substr(11,2), theDate.substr(14,2), theDate.substr(17,2)*/
			);
		return dateString.formatString(template);
	}
	
};
//}}}

//{{{
config.macros.rssFeedUpdate = {
	label: "Update",
	prompt: "Clear the cache and redisplay this RssFeed",
	handler: function(place,macroName,params) {
		var feedURL = params[0];
		var tiddlerTitle = params[1];
		createTiddlyButton(place, this.label, this.prompt, 
			function () {
				if (config.macros.rssReader.cache[feedURL]) {
					config.macros.rssReader.cache[feedURL] = null; 
					//story.refreshTiddler(tiddlerTitle,null, true);
			}
			story.refreshTiddler(tiddlerTitle,null, true);
		return false;});
	}
};
//}}}

//{{{
config.macros.rssFeedImportTiddler = {
	label: "Import",
	prompt: "Import this tiddler in this TiddlyWiki",
	askReplaceMsg: "Tiddler already exists, replace it ?",
	handler: function(place,macroName,params) {
		var  feedUrl = params[0];
		var tiddlerTitle = params[1];
		createTiddlyButton(place, this.label, this.prompt, 
			function () {
				if (feedUrl && config.macros.rssReader.cache[feedUrl]) {
					var tiddler = config.macros.rssFeedImportTiddler.parseRssNews(config.macros.rssReader.cache[feedUrl].responseXML, tiddlerTitle);
					if (tiddler && (! store.getTiddler(tiddlerTitle) || confirm(config.macros.rssFeedImportTiddler.askReplaceMsg))) {
						store.addTiddler(tiddler);
						store.notify(tiddler.title, true);
						store.setDirty(true);
					}
				}
			return false;});
	},
	
	// parse a RssFeed for retrieving a Tiddler with title
	parseRssNews: function(xml, title) {
		// ItemList
		if (document.location.protocol.indexOf("http") == -1) {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
		}

		var itemList = xml.getElementsByTagName('item');
		for (var i=0; i<itemList.length; i++){

			var titleElm = itemList[i].getElementsByTagName('title').item(0);
			var titleText = titleElm.firstChild.nodeValue;
			if (titleText == title) {
				//	<tiddlywiki:title>
				//	titleText
				titleText = titleText.htmlDecode();
				//	<tiddlywiki:wikitext>
				var elem = itemList[i].getElementsByTagName('wikitext').item(0);
				var text = elem ? elem.firstChild.nodeValue.htmlDecode() : "";
				//	<tiddlywiki:modifier>
				elem = itemList[i].getElementsByTagName('modifier').item(0);
				var modifier = elem ? elem.firstChild.nodeValue : "";
				//	<tiddlywiki:modified>
				elem = itemList[i].getElementsByTagName('modified').item(0);
				var modified = elem ? Date.convertFromYYYYMMDDHHMM(elem.firstChild.nodeValue) : "";
				//	<tiddlywiki:created>
				elem = itemList[i].getElementsByTagName('created').item(0);
				var created = elem ? Date.convertFromYYYYMMDDHHMM(elem.firstChild.nodeValue) : "";
				//	<tiddlywiki:links>
				//	Links ?
				//	<tiddlywiki:tags>
				elem = itemList[i].getElementsByTagName('tags').item(0);
				var tags = elem ? elem.firstChild.nodeValue.htmlDecode() : "";
				var tiddler = new Tiddler();
				tiddler.assign(titleText,text,modifier,modified,tags,created);
				return tiddler;
			}
		}
		// not found 
		alert("Tiddler \[[" + title +"]] notFound.");
		return null;
	}

};

//}}}
