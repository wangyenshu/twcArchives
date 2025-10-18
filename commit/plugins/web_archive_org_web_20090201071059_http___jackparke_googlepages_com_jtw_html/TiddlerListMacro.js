/***
|''Name:''|TiddlerListMacro|
|''Version:''|2.3 (8-Jan-2008)|
|''Source''|http://jackparke.googlepages.com/jtw.html#TiddlerListMacro ([[del.icio.us|http://del.icio.us/post?url=http://jackparke.googlepages.com/jtw.html%23TiddlerListMacro]])|
|''Author:''|[[Jack]]|
|''Type:''|Macro|
|''Documentation:''|[[TiddlerListMacroDocumentation]]|
!Usage
{{{<<tiddlerList parameter1:"value1" parameter2:"value2" ...>>}}}
See TiddlerListMacroDocumentation and TiddlerListMacroExamples
!Code
***/
//{{{
version.extensions.tiddlerList = {major: 2, minor: 3, revision: 0, date: new Date("Jan 08, 2008")};
// template = [header, item, separator, group, footer]
config.macros.tiddlerList={
 formats : {list:true, nlist:true, span:true, stack:true, csv:true, table:true},
 templates : {
 list : [ "%0\n", "* %0\n", "", "%group\n", "%0\n"],
 nlist : [ "%0", "# %0\n", "", "%group\n", "%0\n"],
 span : [ "%0", "%0", " ", "%group", "%0"],
 stack : [ "%0", "%0", "\n", "%group", "%0"],
 csv : [ "%0", "%0", ", ", "%0", "%0\n"],
 table : ["|!%0|\n", "|%0|\n", "", "|%group|\n", "|%0|\n"]
 },
 dateFormat : "DD MMM YYYY"
}

if (typeof gCurrentTiddler == 'undefined')
 var gCurrentTiddler;

config.macros.tiddlerList.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
 // Some globals
 var count=0, groupCount=0, theGroup="", lastGroup="", firstInGroup = false;
 var currentTiddler = tiddler;
 gCurrentTiddler = tiddler;
 var listWikiText="";
 var formats = this.formats;
 
 // SQL-Like parameters
 var parameters = paramString.parseParams("name",null,true);
 var pTags = parameters[0]["tags"]?parameters[0]["tags"][0].split(","):[];
 var pOrder = parameters[0]["order"]?parameters[0]["order"][0]:"title";
 var pTop = parameters[0]["top"]?parameters[0]["top"][0]:-1;
 var pText = parameters[0]["text"]?parameters[0]["text"][0]:"";
 var pTitle = parameters[0]["title"]?parameters[0]["title"][0]:"";
 var pSearch = parameters[0]["search"]?parameters[0]["search"][0]:"";
 var pFilter = parameters[0]["filter"]?parameters[0]["filter"][0]:"";
 var pHeader = parameters[0]["header"]?paramFormat(parameters[0]["header"][0]):"";
 var pFooter = parameters[0]["footer"]?paramFormat(parameters[0]["footer"][0]):"";
 var pGroup = parameters[0]["group"]?parameters[0]["group"][0]:"";
 var pDateFormat = parameters[0]["dateFormat"]?parameters[0]["dateFormat"][0]:this.dateFormat;
 var pCustomParameter = parameters[0]["customParameter"]?parameters[0]["customParameter"][0]:"";
 var pFormat = parameters[0]["format"]?parameters[0]["format"][0]:"list";
 pFormat = formats[pFormat]?pFormat:"list"
 
 // Separator
 var pSeparator = parameters[0]["separator"]?paramFormat(parameters[0]["separator"][0]):(parameters[0]["seperator"]?paramFormat(parameters[0]["seperator"][0]):this.templates[pFormat][2])

 // Template for group
 var pGroupTemplate = this.templates[pFormat][3];
 if (parameters[0]["groupTemplate"])
 pGroupTemplate = paramFormat(parameters[0]["groupTemplate"][0])
 pGroupTemplate = pGroupTemplate.replace("$))", ">>")
 
 // Template for group footer
 var pGroupFooterTemplate = "";
 if (parameters[0]["groupFooterTemplate"])
 pGroupFooterTemplate = paramFormat(parameters[0]["groupFooterTemplate"][0])
 pGroupFooterTemplate = pGroupFooterTemplate.replace("$))", ">>")
 
 // Template for item
 var pItemTemplate = this.templates[pFormat][1];
 if (parameters[0]["itemTemplate"])
 pItemTemplate = paramFormat(parameters[0]["itemTemplate"][0])
 pItemTemplate = pItemTemplate.replace("$))", ">>").replace("%link", "%0").replace("%item", "%1").replace("%abstract", "%2").replace("%text", "%3").replace("%created", "%4").replace("%modified", "%5").replace("%modifier", "%6").replace("%group", "%7").replace("%title", "%8").replace("%tags", "%9").replace("%nolink", "%10").replace("%custom", "%11")
 // Template for footer
 var pFooterTemplate = this.templates[pFormat][4].replace("%count", "%1")

 // Get all tiddlers
 var tiddlers = store.reverseLookup("tags","excludeLists",false);

 // Sorting
 if(!pOrder)
 pOrder = "title";
 if (pOrder.match(/^\-/i)) {
 pOrder = pOrder.substr(1)
 var sortDesc = true;
 }
 // Sorting on a standard field
 if (pOrder.match(/(title)|(text)|(modifier)|(modified)|(created)|(tags)/))
  if (sortDesc)
   tiddlers.sort(function (a,b) {if(a[pOrder] == b[pOrder]) return(0); else return (a[pOrder] > b[pOrder]) ? -1 : +1; });
  else
  tiddlers.sort(function (a,b) {if(a[pOrder] == b[pOrder]) return(0); else return (a[pOrder] < b[pOrder]) ? -1 : +1; });
 else
  if (sortDesc)
   tiddlers.sort(function (a,b) {if(a.fields[pOrder] == b.fields[pOrder]) return(0); else return (a.fields[pOrder] > b.fields[pOrder]) ? -1 : +1; });
  else
   tiddlers.sort(function (a,b) {if(a.fields[pOrder] == b.fields[pOrder]) return(0); else return (a.fields[pOrder] < b.fields[pOrder]) ? -1 : +1; });

 // Header
 if (pHeader)
 listWikiText += formatItem(this.templates[pFormat][0], [pHeader], pFormat)
 
 for(var t=0; t<tiddlers.length; t++) {
 tiddler = tiddlers[t];
 if (pText!="" && tiddler.text=="") tiddler.text=store.getValue(tiddler, 'text')
 if (pTop==-1 || count<pTop) {
 if (pText=="" || tiddler.text.match(pText)) {
 if (pTitle=="" || tiddler.title.match(pTitle)) {
 if (pSearch=="" || (tiddler.title.match(pSearch) || tiddler.text.match(pSearch))) {
 if (pFilter=="" || eval(pFilter)) {
 if (pTags.length==0 || compareArrays(tiddler.tags, pTags, "all")) {
 count++;
 if (tiddler.text=="") tiddler.text=store.getValue(tiddler, 'text')
 // Grouping
 if (pGroup) {
 theGroup = eval(pGroup);
 if(theGroup != lastGroup) {
 groupCount++;firstInGroup = true;
 if (pGroupFooterTemplate && groupCount>1)
 listWikiText += pGroupFooterTemplate.replace("%group", theGroup)
 listWikiText += pGroupTemplate.replace("%group", theGroup)
 lastGroup = theGroup;
 } else
  firstInGroup = false;
 }
 // Separators
 if (count>1 && !firstInGroup) listWikiText += pSeparator;
 //Plaintext title
 var noLink = tiddler.title.match(config.textPrimitives.wikiLink)?"~" + tiddler.title:tiddler.title;
 // Custom parameter
 if (pCustomParameter)
 var custom="";
 try {
 custom = eval(pCustomParameter)
 } catch (e) {}
 // List individual tiddler
 var strItem = formatItem(pItemTemplate,["[[" + tiddler.title + "]]",count,tiddler.text.substr(0,300),tiddler.text,tiddler.created.formatString(pDateFormat),tiddler.modified.formatString(pDateFormat),tiddler.modifier,theGroup,tiddler.title,tiddler.tags.join(" "),noLink,custom], pFormat)
 for (var fld in tiddler.fields) strItem = strItem.replace('%field.' + fld, tiddler.fields[fld]);
 listWikiText += strItem
 }
 }
 }
 }
 }
 }
 }
 
 // Last group footer
 if (pGroup && pGroupFooterTemplate && count>0)
 listWikiText += pGroupFooterTemplate.replace("%group", theGroup)

 // Footer
 if (pFooter) {
 pFooter = pFooter.replace("%count", count)
 listWikiText += formatItem(pFooterTemplate, [pFooter], pFormat)
 }
 
 // Render result
 if (!parameters[0]["debug"])
 wikify(listWikiText,place, null, currentTiddler)
 else
 place.innerHTML = "<textarea style=\"width:100%;\" rows=30>" + listWikiText + "</textarea>"
 
 
 // Local functions
 
 function paramFormat(param) {
 // Allow "\n" in non evalled parameters
 return param.replace(/\\n/g, "\n");
 }
 
 function formatItem(template, values, format) {
 // Fill template with values (depending on list format)
 if (format.match(/table/) && values[0].match(/\|/))
 return ("%0\n").format(values)
 else
 return template.format(values)
 }
 
 function compareArrays(array, values, logic) {
 // Compare items in array with AND("all") or OR("any") logic
 var matches=0;
 for(var v=0; v<values.length; v++) 
 if(values[v].replace(/^\s+|\s+$/g,"").match(/^\-/) && !array.contains(values[v].replace(/^\s+|\s+$/g,"").substr(1)))
 matches++;
 else if (array.contains(values[v]))
 matches++;
 return ((logic=="all" && matches==values.length) || (logic!="all" && matches>0))
 }
 
}

String.prototype.prettyTrim = function(len,prefix,postfix) {
 var result = this.trim().replace(/\r\n/g,' ').replace(/\n/g,' ');
 if (!prefix) prefix = '';
 if (!postfix) postfix = '';
 if (result.length > len - 3)
 return prefix + result.substr(0,len) + '...' + postfix;
 else if (result.length > 0)
 return prefix + result + postfix;
 else
 return result;
}

//}}}