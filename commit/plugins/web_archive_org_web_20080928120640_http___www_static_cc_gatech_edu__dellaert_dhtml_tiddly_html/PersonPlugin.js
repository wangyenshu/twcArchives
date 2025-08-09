/***
|Name|PersonPlugin|
|Created by|[[Frank Dellaert|http://www.cc.gatech.edu/~dellaert]]|
|Location|http://www.cc.gatech.edu/~dellaert/#PersonPlugin|
|Version|1.0|
!!!Description
A TiddlyWikiMacro to create aliases (similar to AliasPlugin) that refer to people. The macro takes the following (mandatory) arguments:
* macro name, e.g. "FDE"
* person name, e.g. "Frank Dellaert"
* url: a url to a web-page
A second macro, "personLookup" supports reverse lookup, which is used in the BibTexPlugin.
!!Example
{{{<<person FDE "Frank Dellaert" http://www.cc.gatech.edu/~dellaert>>}}}<<person FDE "Frank Dellaert" http://www.cc.gatech.edu/~dellaert>>
{{{<<FDE>>}}}
<<FDE>>

An example of lookup by name:
{{{<<personLookup "Frank Dellaert">>}}}
<<personLookup "Frank Dellaert">>

If the person is not defined, we just render the name:
{{{<<personLookup "Foo Bar">>}}}
<<personLookup "Foo Bar">>
!!!Installation
Import (or copy/paste) this tiddler into your document: and tag it with "systemConfig"
!!!Code
***/
//{{{
config.macros.person= { };

// create alias as in AliasPlugin
config.macros.person.helper = function(alias,name,url) {
  // create new macro (as needed) 
  if (config.macros[alias]==undefined) {
    config.macros[alias] = { };
    config.macros[alias].handler = function (place,macroName,params) {
      record = config.macros[macroName];
      if (record.url) {
        wikify("[["+record.name+"|"+record.url+"]]", place)
      } else {
        wikify(record.name, place)
      }
    }
  }
  // fill record
  config.macros[alias].name = name;
  config.macros[alias].url = url;
  // reverse name lookup
  config.macros.person[name.replace(/ /g,"_")]=alias;
}

// parse arguments to macro and call helper
config.macros.person.handler = function(place,macroName,params) {
  var alias=params.shift(); if (!alias) return;
  // don't allow spaces in alias
  alias=alias.replace(/ /g,"_");
  config.macros.person.helper(alias,params[0],params[1]);
}

// reverse lookup
config.macros.personLookup={};
config.macros.personLookup.handler = function(place,macroName,params) {
  var name = params.shift();
  if (!name) return;
  var alias = config.macros.person[name.replace(/ /g,"_")];
  var macro = config.macros[alias]
  if (macro) {macro.handler(place,alias,params)} else {wikify(name,place)}
}
//}}}
