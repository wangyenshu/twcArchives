/***
|Name|PublicationPlugin|
|Created by|[[Frank Dellaert|http://www.cc.gatech.edu/~dellaert/tiddly.html]]|
|Location|http://www.cc.gatech.edu/~dellaert/tiddly.html#PublicationPlugin|
|Version|1.0|
!Description
A simple plugin to format publication references. This macro takes the following (mandatory) arguments in order:
*title: title of the publication
*url: url to publication
*authors: a comma separated list of author names or aliases defined using [[AliasPlugin|http://www.tiddlyforge.net/pytw/#AliasPlugin]]
*citation: booktitle or journal or institution, will become a Tiddler link
*year: publication year
The publication is then rendered using a link to the paper, with author aliases substituted (if defined), and the citation rendered as a Tiddler link.
!Example
{{{<<alias A1 First Author>>}}}<<alias A1 First Author>>
{{{<<alias A2 "[[Linked Author|a2.html]]">>}}}<<alias A2 "[[Linked Author|a2.html]]">>
{{{<<A1>>, <<A2>>}}}
   <<A1>>, <<A2>>

{{{<<pub "My Paper's Title" URL "A1,A2" "Some Journal" 2005>>}}}
    <<pub "My Paper's Title" URL "A1,A2" "Some Journal" 2005>>

{{{<<pub "My Other Paper" URL2 "A2" "Some Conference" 2003>>}}}
    <<pub "My Other Paper" URL2 "A2" "Some Conference" 2003>>

!Code
***/
//{{{
config.macros.pub = {};

function adorn(author) {
   var alias = config.macros[author];
   if (alias) {return alias.name?alias.name:alias.text} else {return author}
}

config.macros.pub.handler= function(place,macroName,params) {
  var title = params[0];
  var url = params[1];
  var authors = params[2].split(",");
  var citation = params[3];
  var year = params[4];

  // expand author aliases
  var aliases = adorn(authors[0]);
  for (var i=1; i < authors.length; i++) {
    aliases = aliases + ", " + adorn(authors[i])
  }
  wikify("''[[" + title + "|" + url + "]]'', " + aliases + ", [[" + citation + "]], " + year, place);
}

//}}}
