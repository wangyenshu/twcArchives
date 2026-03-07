/***
|Name|TreeviewPluginPlugin2|
|Source|http://treeview.tiddlyspot.com/|
|Version|0.24|
|Author|MarkS|
|License|Various. See respective libraries for details|
|Type|plugin|
|Requires(1) |jQuery library, treeview plugin libraries and styles |
|Requires(2) |AttachFilePackage and sub-libraries from tiddlytools.com if you want to use embedded images to create the tree|
|Description|Creates a tag tree, formatted as an actual tree |
|Status|Experimental - ALPHA, but built on fairly solid technologies|
|Warning|When creating tag trees, make sure no tiddler loops back on itself, or its likely the script will hang|
!!!!Set up for portability
You will need a version of TW that incorporates the jQuery library. That happens automatically with recent editions of TW. You will also need to install or access the treeview libraries from http:www.dynamicdrive.com. The libraries can be carried as local files, inserted in the MarkupPostBody, or referenced from the dynamicdrive site. Each approach will require a different set up. 
You will also need to link in the stylesheet for the treeview objects. A quick way to do this is to put:
>{{{<link rel="stylesheet" type="text/css" href="http://www.dynamicdrive.com/dynamicindex1/treeview/jquery.treeview.css" /> }}}
into the MarkupPreHead tiddler. However, this won't work if you go off line. It also doesn't work permanently if you are hosting your file on a web server. So you may want to download a copy of the stylesheet and attendant image files and change the MarkupPreHead tiddler to pick up the local copy. Or load the stylesheet and images onto your own server where you will be able to access them.
!!!!Usage
{{{<<treeview2 }}}
>{{{<root tag> [tree style] [startup parameters]}}} 
{{{  >>}}}

!!!!!Where:
''root tag'' is the tag at the top of your tagging tree, i.e. the mother of all tiddlers related to it by using its name as one of their tags.
''tree style'' indicates which type of tree will be displayed,  possibly //treeview//, //filetree//, and //treeview-red//, and //treeview-famfamfam//. There may be other styles too, but those are the ones I know about.
''startup parameters'' are a set of optional parameters given in a comma-separated, key/value string like this:
>{{{'collapsed: false, animated: "normal", persist: true'}}}
There's a list of possible options at:
  http://www.dynamicdrive.com/dynamicindex1/treeview/index.htm
However, not all settings may actually work under TW. Mainly, you will probably be interested in controlling the presence of animation, and whether the initial state of the tree is opened or closed.
!!!!Images and stylesheet set-up
The tree is constructed from little bits of images. If you don't want to carry these images in a separate directory, nor reference them remotely, you can embed them in your TW file. To do this,  you will need the AttachFilePackage and accompanying plugins from 
> www.tiddlytools.com
and you will need the AttachFilePluginFormatters plugin from the same site.
Then import all the tiddlers from this file tagged as treeviewimage . These images are referenced in the StyleSheet. If you import JqueryTreeviewCss from this file, and then put the name in your StyleSheet, the images should be imported without having to access them remotely.
!!!!Persistence
To make persistence work, you will need to have the treeview cookie library loaded. The easiest way to do that is to put:
>{{{<script src="http://www.dynamicdrive.com/dynamicindex1/treeview/lib/jquery.cookie.js" type="text/javascript"></script>}}}
into the MarkupPostBody. However, this technique will only work if you have online access. If you will be working offline, then you will either need to download the cookie library to the same directory as your ~TiddlyWiki file and put the following into your MarkupPostBody:
>>{{{<script src="jquery.cookie.js"></script>}}}
or you will need to put the entire contents of the cookie library into script tags inside the MarkupPostBody.
Then, in any macro that wants its tree to be persistently configured, you will need to use configuration parameter:
>>{{{persist: "cookie", cookieId: "myid"}}}
where //myid// should be an identification that will be unique throughout the entire TW file.
***/
//{{{
config.macros.treeview2 = {
  handler: function (place, macroName, params, wikifier, paramString, tiddler)
  {  // Code here
var lcTag = params[0] ;
var lcClass = params[1] ? params[1] : "treeview" ;
var DEV_MODE = false ; // Make true when developing code or changes won't show up.
try {
  if( MAS === undefined ) MAS = { } ;
} catch(ex) {
  MAS = {} ;
}

MAS.treeviewSettings = function(obj) {
	var defa = {} ;
	defa.collapsed= true;
	defa.unique = true ;
	//defa.persist= "location" ;
	if( obj !== undefined ) {
		try {
		obj = eval("({" + obj + "})" ) ;
		} catch(ex) {
			alert("Unable to use your treeview configuration settings!") ;
			return defa ;
		}
		for (var prop in obj) {
			defa[prop] =obj[prop] ;
		}
	}
	return defa ;
} ;
if( DEV_MODE || MAS.getTiddlersPerTagAsHtmlList === undefined ) {
MAS.getTiddlersPerTagAsHtmlList = function(tagname,setup) { 
  var tids = store.getTaggedTiddlers(tagname) ;
  var temp = "" ;
	var prefix = tids.length > 0 ? "<span class='folder'>" : "<span class='file'>" ; 
	var statetags = store.getTiddler(tagname).tags ;
	var state = "" ;
	var lcSesame = setup["sesame"] !== undefined ? setup["sesame"] : "" ;
	var lcAntiSesame = setup["antisesame"] !== undefined ? setup["antisesame"] : "" ;
	if(statetags.length > 0 ) {
						 if(lcSesame) state =  statetags.contains(lcSesame) ? ' class="open"'   : ' class="closed"'  ;
						 if(lcAntiSesame) state = statetags.contains(lcAntiSesame) ? ' class="closed"' : ' class="open"'   ;
	}	
// state="" ; // DEBUG
  //var rtn ="<li>"  + prefix + tagname + "</a></span>" ;
	var rtn = "<li" + state +">"  + prefix + "<a href=\"javascript:;\" tiddlylink=\"" + tagname + "\"  refresh=\"link\"    class='tiddlyLink tiddlyLinkExisting' title='Link to " + tagname + "' >" + tagname + "</a></span>" ;
	//wikify(rtn,place) ;
  forever:
  while(true) {  
		if(tids.length == 0 ) break ;
   	rtn = rtn + "<ul>" ;
   	for(var i=0;i<tids.length;i++) {
			temp = MAS.getTiddlersPerTagAsHtmlList(tids[i].title, setup) ;
     	rtn = rtn +  temp  ;
  	}
  	rtn = rtn + "</ul>\n" ;
		break ;
  } // forever
  rtn = rtn + "</li>\n" ;
  return rtn ;
}  ; // End of function definition
} // End of checking if function already defined

// The extra set of span tags are needed here because jquery find function ignores
// the outer set of tags. Or at least that's what seems to be happening. So, I give
// it an extra set so it can throw it away without consequence
var loSetup = MAS.treeviewSettings(params[2]) ;
var lcId = "root" + (new Date()).getTime().toString() ;
if(loSetup.cookieId) {
	lcId = "root_" + loSetup.cookieId ; 
}
//var a =  '<span id="' + lcId + '"><ul id="' + "root" + '" >' +  MAS.getTiddlersPerTagAsHtmlList(lcTag, loSetup) + "</ul></span>" ;
var a =  '<ul id="' + lcId + '" >' +  MAS.getTiddlersPerTagAsHtmlList(lcTag, loSetup) + "</ul>" ;
var b = jQuery(a) ; 
// A smarter person might have know how to put the onclick function in at the top 
b.find("a").each(function(n) {
	this.onclick = onClickTiddlerLink ;
	}) ;
//b.find(lcId).attr("class",lcClass) ;
//b.find("#root").attr("class",lcClass) ;

jQuery(place).append(b) ;

jQuery(place).find("#" + lcId).attr("class",lcClass).treeview(loSetup) ;
  }
};
//}}}