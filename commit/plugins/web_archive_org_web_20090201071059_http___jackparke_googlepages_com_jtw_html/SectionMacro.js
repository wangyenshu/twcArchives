/***
|''Name:''|~SectionMacro|
|''Version:''|0.9.4 (20-Apr-2007)|
|''Author:''|[[Jack]]|
|''Type:''|Macro|
!Description
Allows you to create collapsable sections just like the slider macro but without needing to create new tiddlers for these sections.
!Usage
{{{<<section Title Tiddler Text goes here...
and can be multi-
line and include {${${monospace text}$}$}.
>>}}}
<<section Title Tiddler Text goes here...
and can be multi-
line and include {${${monospace text}$}$}.
>>
!Revision History
* Original by [[Jack]] 0.9
* Nested sliders and cookie persistence 0.9.1
* Removed crappy cookie persistance 0.9.2
* Bug-fix with quoted 2st parameter (thanks M. Macolio) 0.9.3
* Bug-fix with monospace text (thanks M. Macolio) 0.9.4
!Code
***/
//{{{
version.extensions.section = {major: 0, minor: 9, revision: 4, date: new Date("Apr 20, 2007")};

config.macros.section = {count:0,display:'none'};
config.macros.section.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
 this.slider(place,"chkSection" + this.count++,paramString.substr(params[0].length+(paramString.substr(params[0].length+1,1).match(/['"]/)?2:1)).replace(/\$\>/g, '>').replace(/}\$}\$}/, '}}}').replace(/{\${\${/, '{{{'),params[0], "tooltip");
}

config.macros.section.slider = function(place,cookie,text,title,tooltips) {
 var btn = createTiddlyButton(place,title,tooltips,config.macros.slider.onClickSlider,"tiddlyLink tiddlyLinkExisting"); 
 var panel = createTiddlyElement(place,"div",null,"timelineSliderPanel",null);
 panel.setAttribute("cookie",cookie);
 panel.style.display = config.options[cookie] ? "block" : "none";
 panel.style.display=this.display;
 if(text) wikify(text,panel);
};
//}}}