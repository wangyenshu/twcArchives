/***
|''Name''|BetterRssHack|
|''Description''|adds author to the rss feed and feeds  only certain tagged tiddlers|
|''Author''|Tobias Beer|
|''Status''|beta|
|''Version''|0.9.1 (2010-10-08)|
|''Type''|core hack|
|''Overwrites''|core function generateRss|
|''Source''|http://tobibeer.tiddlyspace.com/#BetterRssHack|
|''Documentation''|http://tobibeer.tiddlyspace.com/#BetterRss|
|''License''|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''~CoreVersion''|2.5.3|
!Settings
[[include tagged:|AdvancedOptions]] <<option txtRssTag>>
!Code
***/
//{{{
//Set a reasonable default
config.numRssItems=50;

merge(config.optionsDesc,{txtRssTag:'Include only tiddlers with any of these tags in the RSS feed'});

//OVERWRITE
generateRss=function()
{
	var i,t,
	d=new Date(),
	u=store.getTiddlerText('SiteUrl'),
	tids = store.getTiddlers('modified','excludeLists'),
	tgs=config.options.txtRssTag,
	inc=tgs?tgs.readBracketedList():false,
	n=config.numRssItems > tids.length ? 0 : tids.length-config.numRssItems,
	s=[

	//HEADER
	'<?xml version="1.0"?>',
	'<rss version="2.0">',
	'<channel>',
	'<title>' + wikifyPlain('SiteTitle').htmlEncode() + '</title>',
	u?'<link>' + u.htmlEncode() + '</link>':'',
	'<description>' + wikifyPlain('SiteSubtitle').htmlEncode() + '</description>',
	'<language>' + config.locale + '</language>',
	'<copyright>Copyright ' + d.getFullYear() + ' ' + config.options.txtUserName.htmlEncode() + '</copyright>',
	'<pubDate>' + d.toGMTString() + '</pubDate>',
	'<lastBuildDate>' + d.toGMTString() + '</lastBuildDate>',
	'<docs>http://blogs.law.harvard.edu/tech/rss</docs>',
	'<generator>TiddlyWiki ' + formatVersion() + '</generator>'
	]

	//BODY
	for(i=tids.length-1;i>=n;i--){
		t=tids[i];
		if(!inc||t.tags.containsAny(inc)){
			s.push(
				'<item>\n'+ //THANKS FND FOR AUTHOR
				tiddlerToRssItem(t,u).replace('</link>','</link><author>'+t.modifier.htmlEncode()+'</author>')+
				'\n</item>'
			);
		}
	}

	//FOOTER
	s.push('</channel>');
	s.push('</rss>');

	//DONE
	return s.join('\n');
}
//}}}