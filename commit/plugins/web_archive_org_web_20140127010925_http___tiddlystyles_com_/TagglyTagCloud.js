/***
''Plugin:'' TagglyTag Cloud Macro
''Author:'' Clint Checketts
''Source URL:''

//Note the macro name was changed to stop it from clashing with the original TagCloud plugin//

!Usage
<<tagglyTagCloud>>

!Code
***/
//{{{
version.extensions.tagglyTagCloud = {major: 1, minor: 0 , revision: 0, date: new Date(2006,2,4)};
//Created by Clint Checketts, contributions by Jonny Leroy and Eric Shulman

config.macros.tagglyTagCloud = {
 noTags: "No tag cloud created because there are no tags.",
 tooltip: "%1 tiddlers tagged with '%0'"
};

config.macros.tagglyTagCloud .handler = function(place,macroName,params) {
 
var tagCloudWrapper = createTiddlyElement(place,"div",null,"tagCloud",null);

var tags = store.getTags();
for (var t=0; t<tags.length; t++) {
 for (var p=0;p<params.length; p++) if (tags[t][0] == params[p]) tags[t][0] = "";
}

 if(tags.length == 0) 
 createTiddlyElement(tagCloudWrapper,"span",null,null,this.noTags);
 //Findout the maximum number of tags
 var mostTags = 0;
 for (var t=0; t<tags.length; t++) if (tags[t][0].length > 0){
 if (tags[t][1] > mostTags) mostTags = tags[t][1];
 }
 //divide the mostTags into 4 segments for the 4 different tagCloud sizes
 var tagSegment = mostTags / 4;

 for (var t=0; t<tags.length; t++) if (tags[t][0].length > 0){
 var tagCloudElement = createTiddlyElement(tagCloudWrapper,"span",null,null,null);
 tagCloudWrapper.appendChild(document.createTextNode(" "));
 var theTag = createTiddlyLink(tagCloudElement,tags[t][0],true);
 theTag.className += " tagCloudtag tagCloud" + (Math.round(tags[t][1]/tagSegment)+1);

// theTag.setAttribute("tag",tags[t][0]);
 }

};

setStylesheet(".tagCloud span{height: 1.8em;margin: 3px;}.tagCloud1{font-size: 1.2em;}.tagCloud2{font-size: 1.4em;}.tagCloud3{font-size: 1.6em;}.tagCloud4{font-size: 1.8em;}.tagCloud5{font-size: 1.8em;font-weight: bold;}","tagCloudsStyles");
//}}}