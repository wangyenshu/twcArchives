/***
|''Name:''|PhotoGalleryPlugin|
|''Description:''|A photo gallery with optional subtitles|
|''Author:''|Paulo Soares|
|''Version:''|1.3.0|
|''Date:''|2011-04-25|
|''Source:''|http://www.math.ist.utl.pt/~psoares/addons.html|
|''Documentation:''|See the examples|
|''License:''|[[Creative Commons Attribution-Share Alike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]]|
|''~CoreVersion:''|2.5.0|
***/
//{{{
if(!version.extensions.photoGalleryPlugin) { //# ensure that the plugin is only installed once
version.extensions.photoGalleryPlugin = {installed: true};

(function($) {
config.macros.photoGallery = {};

config.macros.photoGallery.handler= function(place,macroName,params,wikifier,paramString,tiddler) {
  var i, args = paramString.parseParams(null,null,false);
  this.url = getParam(args,"url","*");
  this.sequence = getParam(args,"sequence",null);
  var height = getParam(args,"height",null);
  var width = getParam(args,"width",null);
  this.time = parseFloat(getParam(args,"time",0));
  this.start = parseFloat(getParam(args,"start",-1));
  this.labels = getParam(args,"labels",null);
  this.numbers = ($.inArray('numbers',paramString.readMacroParams()) > -1);
  if(!this.sequence){return false;}
  if(this.sequence=="!"){
    var lines = paramString.split("\n");
    if(lines.length>1){
      lines.pop();
      lines.shift();
    } else {return false;}
    this.sequence = lines;
  } else {
    this.sequence = this.parseSequence(this.sequence);
  }
  this.nImages = this.sequence.length;
  this.current = 0;
  if(!store.tiddlerExists(this.labels)) this.labels = null;
  if(this.labels) this.labelsArray = store.getTiddlerText(this.labels).split("\n");
  var pictureHolder = document.createElement('center');
  var image=pictureHolder.appendChild(document.createElement('img'));
  image.src = this.url.replace("*",this.sequence[0]);
  image.id = 'pgObject';
  if(height) image.height = height;
  if(width) image.width = width;
  image.className = "photoGallery";
  place.appendChild(pictureHolder);
  var navBar = createTiddlyElement(pictureHolder,"div");
  createTiddlyButton(navBar,"«","",this.firstImage);
  createTiddlyButton(navBar,"‹","",this.previousImage);
  if(this.time>0) {
    createTiddlyButton(navBar,"►",null,this.auto,null,"pgPlay");
  }
  createTiddlyButton(navBar,"›","",this.nextImage);
  createTiddlyButton(navBar,"»","",this.lastImage);
  if(this.labels) createTiddlyElement(pictureHolder,"div","pgLabel","",this.labelsArray[0]);
  if(this.numbers) createTiddlyElement(navBar,"span","pgCounter","","1/"+this.nImages);
  if(this.time>0 && this.start>-1) setTimeout(this.auto,this.start);
}

config.macros.photoGallery.parseSequence = function(seq) {
  var list = seq.split(","), res = [], limits, i, j;
  for (i=0; i<list.length; i++){
    if(list[i].indexOf("-") == -1){
      res.push(parseInt(list[i]));
    } else {
      limits = list[i].split("-");
      if(limits[0]>limits[1]){
        for(j=parseInt(limits[0]); j>=parseInt(limits[1]); j--){
          res.push(j); 
        }
      } else {
        for(j=parseInt(limits[0]); j<=parseInt(limits[1]); j++){
          res.push(j); 
        }
      }
    }
  }
  return res;
}

config.macros.photoGallery.auto = function() {
  var cm = config.macros.photoGallery;
  if(cm.autoAdvance) {
    clearInterval(cm.autoAdvance);
    cm.autoAdvance = null;
    $("#pgPlay").text('►');
  } else {
    if(cm.time>0) {
      cm.autoAdvance = setInterval(cm.nextImage, cm.time);
      $("#pgPlay").text('■');
    }
  }
}

config.macros.photoGallery.jump = function(step) {
  var target;
  switch (step) {
  case "f":
    target=0;
    break;
  case "l":
    target=this.nImages-1;
    break;
  case "n":
    target = (this.current == this.nImages-1) ? 0 : this.current+1; 
    break;
  case "p":
    target = (this.current == 0) ? this.nImages-1 : this.current-1; 
  }
  this.current = target;
  $("#pgObject").attr("src",this.url.replace("*",this.sequence[target]))
  if(this.numbers) $("#pgCounter").text((target+1) + '/'+ this.nImages);
  if(this.labels) $("#pgLabel").text(this.labelsArray[target]);
}

config.macros.photoGallery.nextImage = function(){config.macros.photoGallery.jump('n');}
config.macros.photoGallery.previousImage = function(){config.macros.photoGallery.jump('p');}
config.macros.photoGallery.lastImage = function(){config.macros.photoGallery.jump('l');}
config.macros.photoGallery.firstImage = function(){config.macros.photoGallery.jump('f');}
})(jQuery)
}
//}}}