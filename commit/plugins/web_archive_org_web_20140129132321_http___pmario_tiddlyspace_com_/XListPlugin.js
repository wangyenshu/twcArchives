/***
|''Name:''|XListPlugin|
|''Description:''|Provides a {{{<<xList>>}}} macro, that prepares the list for drag and drop sorting|
|''Author:''|Mario Pietsch|
|''Version:''|0.2.0|
|''Date:''|2010.08.03|
|''Status:''|''beta''|
|''Source:''|http://apm-plugins.tiddlyspot.com/#XListPlugin|
|''License''|[[MIT License]]|
|''CoreVersion:''|2.5.0|
|''Requires:''|XCaseListPlugin |
|''Documentation:''|this file|
|''Keywords:''|list extended sort filter|
!!!Description
<<<
This macro is only needed if you want to use StylingPackage!
If you call {{{ <<xList>> }}} without any parameter you will get a non sortet list of all tiddlers.

!!!!UseCase
{{{
<<xList xCase [prefix] [regExp] [tag]>>
}}}
>*prefix .. can be any string. Default is "sort."
>*regExp .. can be any valid regExp, that runs against the tiddler title. Default is "." (any char except linebreaks)
>*tag .. "[tag[myTag]]" ''If you have spaces inside the tag, it has to be covered inside double quotes !!''
{{{
eg:
<<xList xCase "sort." "." "[tag[with spaces]]">>
}}}
>The above configuration will produce a custom field named {{{sort.with.spaces}}}. Because custom fields have to be lower case and spaces are not allowed. Since the tag name is used for the custom field, one tiddler can be part of different sorted lists. 
<<<

!!!ToDo
<<<
*Test together with MatchTagsPlugin
<<<

!!!History
<<<
*V 0.2.0 - 2010.08.03
**initial release
<<<

***/
/*{{{*/
config.macros.xList = {};
config.macros.xList.xCase = config.macros.list.xCase;

config.macros.xList.handler = function(place,macroName,params)
{
	var type = params[0] || "xCase";
	var sortField = params[1]  || "sort.";
	var tag = params[2] || ".";
	var tag = params[3] || "";

	tag = tag.toLowerCase();
	sortField = sortField.toLowerCase();

	var match = tag.match(/tag *\[(.+) *\] *\]/im);		// get the tag text
	if (match != null) tag = match[1];

	var res = tag.replace(/^\s+|\s+$/g, ""); 		// remove whitespace start and end
	if (res != null) tag = res;

	res = tag.replace(/ +/g, ".");				// replace spaces with a dot 
	if (res != null) tag = res;

	params[1] = sortField+tag;

	var list = document.createElement("ul");

	list.setAttribute('class', 'xList');
	list.setAttribute('tag', tag);
	list.setAttribute('sortfield', sortField);
	place.appendChild(list);
	if(this[type].prompt) {
		createTiddlyElement(list,"li",null,"listTitle",this[type].prompt);
	}
	var results;
	if(this[type].handler) {
// console.log('params: ', params)
		results = this[type].handler(params);
	}
	var li;
	for(var t = 0; t < results.length; t++) {
		li = document.createElement("li");
		li.setAttribute('id', typeof results[t] == "string" ? results[t] : results[t].title);
		list.appendChild(li);
		createTiddlyLink(li,typeof results[t] == "string" ? results[t] : results[t].title,true);
	}
};
/*}}}*/