/***
''Do not download or install yet. This project is [[In Flux]] and will likely change drastically before I release a first version. Look in [[Plugins]] for code I released.''
|Name|BibTexPlugin|
|Created by|[[Frank Dellaert|http://www.cc.gatech.edu/~dellaert]]|
|Location|http://www.cc.gatech.edu/~dellaert/#BibTexPlugin|
|Version|In Flux|
++++!!![Description|Click to open/close]
A TiddlyWikiMacro to enable formatting publication references from a <<wikipedia Bibtex>> entry. It works in the [[AliasPlugin|http://www.tiddlyforge.net/pytw/#AliasPlugin]] style: after calling {{{<<bibtex text>>}}} a macro is defined that can be invoked by the ~BibTex entry's key.
The parsing is rather primitive and hence the ~BibTex cannot be arbitrary. In particular (but probably not exhaustively):
* you can't use commas inside values
* you cannot use multi-line entries
The author's names are looked up in the database of people defined by  [[PersonPlugin|http://www.cc.gatech.edu/~dellaert/#PersonPlugin]]. They have to be an exact match to the name defined by {{{<<person>>}}}.
===
+++!!![Example|Click to open/close]
{{{<<bibtex  "@InProceedings{Dellaert05aaai,
  author =	 {Frank Dellaert and Alexander Kipp and Peter Krauthausen},
  title =	 {A Multifrontal {QR} Factorization Approach to Distributed Inference applied to Multi-robot Localization and Mapping},
  booktitle =	 AAAI,
  year =	 2005,  
  url =		 {http://www.cc.gatech.edu/~dellaert/pubs/Dellaert05aaai.pdf}
}">>}}}
<<bibtex "@InProceedings{Dellaert05aaai,
  author =	 {Frank Dellaert and Alexander Kipp and Peter Krauthausen},
  title =	 {A Multifrontal {QR} Factorization Approach to Distributed Inference applied to Multi-robot Localization and Mapping},
  booktitle =	 AAAI,
  year =	 2005,  
  url =		 {http://www.cc.gatech.edu/~dellaert/pubs/Dellaert05aaai.pdf}
}">>
{{{<<Dellaert05aaai>>}}}
<<Dellaert05aaai>>
===
+++!!![Installation|Click to open/close]
Import (or copy/paste) this tiddler into your document: and tag it with "systemConfig". In addition, the code relies on:
# the external JavaScript code in the file [[bibtex.js|bibtex.js]]. You can also paste that code below if you want a self-contained TiddlyWiki.
# [[PersonPlugin|http://www.cc.gatech.edu/~dellaert/#PersonPlugin]]
# [[NestedSlidersPlugin|http://www.tiddlyforge.net/pytw/#NestedSlidersPlugin]]
===
***/
// //+++!!![Code|Click to open/close]
//{{{
config.macros.bibtex = {};

// format a BibTex entry
config.macros.bibtex.format = function(place, entry) {
  // start with title linked to url
  wikify("''[[" + entry.title + "|" + entry.url + "]]'', ", place);

  // Now reverse lookup authors if they are defined
  function expand(author) {
    config.macros.personLookup.handler (place,"personLookup",[author])
  }
  var authors = entry.author.split(" and ");
  var nrAuthors = authors.length;
  expand(authors[0]);
  if (nrAuthors==2) {
    wikify(" and ",place); expand(authors[1]);
  }
  else {
    for (var i=1; i < nrAuthors; i++) {
      if (i==nrAuthors-1) {wikify(", and ",place)} else  {wikify(", ",place)};
      expand(authors[i])
    }
  }

  // finish with specific formatting
  switch(entry.type) {
    case "Article": wikify(", " + entry.journal, place); break;
    case "InProceedings": wikify(", " + entry.booktitle, place); break;
    case "TechReport": wikify(", " + entry.institution + ", " + entry.number, place); break;
  }
   wikify(", " + entry.year, place);
   wikify("   +++[BibTex|Show BibTex Entry]>{{{"+entry.text+"}}}===", place);
 }

// Define a macro (as in AliasPlugin)
config.macros.bibtex.helper = function(alias,entry) {
  if (config.macros[alias]==undefined) // create new macro (as needed)
    {
    config.macros[alias] = {};
    config.macros[alias].handler = function (place,macroName,params) {
      var entry = config.macros[macroName].entry;
      config.macros.bibtex.format(place, entry)
    }
  }
  config.macros[alias].entry = entry; // define entry
}

// parse arguments to macro and call helper
config.macros.bibtex.handler = function(place,macroName,params) {
  var text = params[0];
  var entry = new BibTexEntry(text);
  //alert(entry.toString()); // for debugging
  var alias = entry.key;
  config.macros.bibtex.helper(alias,entry);
  // wikify("{{{"+text+"}}}", place); // uncomment this if feedback required
}
//}}}
// //===