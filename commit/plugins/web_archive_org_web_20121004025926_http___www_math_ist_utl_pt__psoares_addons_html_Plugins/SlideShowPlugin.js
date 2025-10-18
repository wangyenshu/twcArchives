/***
|''Name:''|SlideShowPlugin|
|''Description:''|Creates a slide show from any number of tiddlers|
|''Author:''|Paulo Soares|
|''Contributors:''|John P. Rouillard|
|''Version:''|2.2.6|
|''Date:''|2010-11-17|
|''Source:''|http://www.math.ist.utl.pt/~psoares/addons.html|
|''Documentation:''|[[SlideShowPlugin Documentation|SlideShowPluginDoc]]|
|''License:''|[[Creative Commons Attribution-Share Alike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]]|
|''~CoreVersion:''|2.5.0|
***/
//{{{
if(!version.extensions.SlideShowPlugin) { //# ensure that the plugin is only installed once
version.extensions.SlideShowPlugin = {installed: true};

(function($) {
config.macros.slideShow = {maxTOCLength: 30, separator:'-s-'};

config.formatters.push( {
	name: "SlideSeparator",
	match: "^"+config.macros.slideShow.separator+"+$\\n?",
	handler: function(w) {
		createTiddlyElement(w.output,"hr",null,'slideSeparator');
	}
});

config.macros.slideShow.text = {
  label: "slide show", tooltip: "Start slide show",
  quit: {label: "x", tooltip: "Quit the slide show"},
  firstSlide: {label: "<<", tooltip: "Go to first slide"},
  previous: {label: "<", tooltip: "Go back"},
  next: {label: ">", tooltip: "Advance"},
  lastSlide: {label: ">>", tooltip: "Go to last slide"},
  goto: {label: "Go to slide:"},
  resetClock: {tooltip: "Reset the clock"},
  overlay: "overlay"
};

config.macros.slideShow.handler = function(place,macroName,params,wikifier,paramString){
  var args = paramString.parseParams(null,null,false);
  this.label = getParam(args,"label",this.text.label);
  this.tooltip = getParam(args,"tooltip",this.text.tooltip);
  var onclick = function(){config.macros.slideShow.onClick(place,paramString); return false;};
  createTiddlyButton(place,this.label,this.tooltip,onclick);
  return false;
}

config.macros.slideShow.onClick = function(place,paramString) {
  var slide, cm = config.macros.slideShow;
  var title = story.findContainingTiddler(place);
  title = title ? title.getAttribute("tiddler") : null;
  var args = paramString.parseParams(null,null,false);
  title =  getParam(args,"tiddler",title);
  var argsArray = paramString.readMacroParams();
  this.single = ($.inArray('single',argsArray) > -1);
  this.clicks = ($.inArray('noClicks',argsArray) < 0);
  this.keyboard = ($.inArray('noKeyboard',argsArray) < 0);
  this.showAll = ($.inArray('showAll',argsArray) > -1);
  this.cycle = ($.inArray('cycle',argsArray) > -1);
  this.overlays = ($.inArray('noOverlays',argsArray) < 0);
  this.theme = getParam(args,"theme");
  this.tag = getParam(args,"tag");
  this.toc = getParam(args,"toc","headers");
  this.sort = getParam(args,"sort");
  this.clockFormat = getParam(args,"clockFormat",'0hh:0mm:0ss');
  this.auto = getParam(args,"auto",0);
  this.header = getParam(args,"header",title);
  this.footer = getParam(args,"footer","");
  this.clock = getParam(args,"clock");
  this.blocked = 0;
  if(this.clock){
    var startTime = new Date(0);
    this.clockCorrection=startTime.getTimezoneOffset()*60000;
    startTime = new Date();
    this.clockMultiplier = 1;
    this.clockInterval = 0;
    var clockType= parseFloat(this.clock);
    if(clockType < 0) {
      this.clockMultiplier = -1;
      this.clockInterval = -clockType*60000;
    } else if(clockType == 0){
      this.clockCorrection = 0;
      startTime = new Date(0);
    }
    this.clockStartTime=startTime.getTime();
  }
  this.slides = [];
  this.openTiddlers = [];
  $("#tiddlerDisplay > *").each(function(){cm.openTiddlers.push($(this).attr('tiddler'))});
  var count = 0;
  this.slideTOC=[];
  if(this.single){
    if(!store.tiddlerExists(title)) return;
    var newTiddler;
    var content = store.getTiddlerText(title).split(cm.separator);
    $.each(content, function(){
      count++;
      newTiddler = new Tiddler();
      newTiddler.title ="TempSlide" + count;
      newTiddler.tags[0] = "excludeLists";
      newTiddler.text = $.trim(this);
      newTiddler.fields['doNotSave']= true;
      store.addTiddler(newTiddler);
      cm.buildTOC(count,newTiddler.title);
      cm.slides.push(newTiddler.title);
    });
  } else {
    if(this.tag){
      var content = store.getTaggedTiddlers(this.tag,this.sort);
      $.each(content, function(){
        count++;
        cm.buildTOC(count,this.title);
        cm.slides.push(this.title);
      });
    } else {
      story.displayTiddler(null,title);
      var list = $('[tiddler='+title+']').find('.viewer').find('.tiddlyLinkExisting');
      $.each(list,function(){
        if(!$(this).parents().hasClass("exclude")){
          slide = $(this).attr('tiddlylink');
          count++;
          cm.buildTOC(count,slide);
          cm.slides.push(slide);
        }
      });
    }
  }
  this.nSlides = this.slides.length;
  if(this.nSlides==0) return false;
  clearMessage();
  this.toggleSlideStyles();
  if(!this.showAll){
    //Attach the key and mouse listeners
    if(this.keyboard && !$("#tiddlerDisplay").hasClass("noKeyboard")) $(document).keyup(cm.keys);
    if(this.clicks){
      $(document).mouseup(cm.clicker);
      document.oncontextmenu = function(){return false;}
    }
    if(this.clock) this.slideClock=setInterval(this.setClock, 1000);
    if(this.auto>0){
      this.autoAdvance=setInterval(cm.next, this.auto*1000);
    }
    this.showSlide(1);
  } else {
    story.closeAllTiddlers();
    story.displayTiddlers(null,this.slides);
    $(".tiddler").attr("ondblclick",null);
    $(document).keyup(cm.endSlideShow);
  }
  return false;
}

config.macros.slideShow.buildNavigator = function() {
  //Create the navigation bar
  var i, slidefooter = $("#controlBar")[0];
  if(!slidefooter) return;
  $(slidefooter).addClass("slideFooterOff noClicks");
  var navigator = createTiddlyElement(slidefooter,"SPAN","navigator");
  var buttonBar = createTiddlyElement(navigator,"SPAN","buttonBar");
  //Make it so that when the footer is hovered over the class will change to make it visible
  $(slidefooter).bind("mouseenter mouseleave", function(e){$(this).toggleClass("slideFooterOff");});
  //Create the control buttons for the navigation
 
  createTiddlyButton(buttonBar,this.text.firstSlide.label,this.text.firstSlide.tooltip,this.firstSlide,"button");
  createTiddlyButton(buttonBar,this.text.previous.label,this.text.previous.tooltip,this.previous,"button");
  createTiddlyButton(buttonBar,this.text.quit.label,this.text.quit.tooltip,this.endSlideShow,"button");
  createTiddlyButton(buttonBar,this.text.next.label,this.text.next.tooltip,this.next,"button");
  createTiddlyButton(buttonBar,this.text.lastSlide.label,this.text.lastSlide.tooltip,this.lastSlide,"button");
  if(this.clock){
    if(this.clock == 0){
       createTiddlyElement(navigator,"SPAN","slideClock");
    } else {
      createTiddlyButton(navigator," ",this.text.resetClock.tooltip,this.resetClock,"button","slideClock");
    }
    this.setClock();
  }
  var index = createTiddlyElement(slidefooter,"SPAN","slideCounter");
  index.onclick = this.toggleTOC;
  var toc = createTiddlyElement(slidefooter,"SPAN","toc");
  var tocLine;
  for(i=0; i<this.slideTOC.length; i++){
    $(toc).append(this.slideTOC[i][2]);
    tocLine = $(toc.lastChild);
    tocLine.addClass("tocLevel"+this.slideTOC[i][1]).css("cursor", "pointer").hover(function () {
        $(this).addClass("highlight");}, function () {
        $(this).removeClass("highlight");});
    tocLine.attr("slide",this.slideTOC[i][0]);
    tocLine.click(config.macros.slideShow.showSlideFromTOC);
  }
  //Input box to jump to specific slide
  var tocItem = createTiddlyElement(toc,"DIV","jumpItem",null,this.text.goto.label);
  var tocJumpInput = createTiddlyElement(tocItem,"INPUT","jumpInput");
  tocJumpInput.type="text";
  $(tocJumpInput).keyup(config.macros.slideShow.jumpToSlide);
}

//Used to shorten the TOC fields
config.macros.slideShow.abbreviate = function(label){
  if(label.length>this.maxTOCLength) {
    var temp = new Array();
    temp = label.split(' ');
    label = temp[0];
    for(var j=1; j<temp.length; j++){
      if((label.length+temp[j].length)<=this.maxTOCLength){
        label += " " + temp[j];
      } else {
        label += " ...";
        break;
      }
    }
  }
  return label;
}

config.macros.slideShow.buildTOC = function(count,title) {
  var level = 1, text;
  switch(this.toc){
  case "headers":
    var frag = wikifyStatic(store.getTiddlerText(title));
    text = frag.replace(/<div class="comment">.*<\/div>/mg,"");
    var matches =  text.match(/<h[123456]>.*?<\/h[123456]>/mgi);
    if(matches){
      for (var j=0; j<matches.length; j++){
        level = matches[j].charAt(2);
        text = matches[j].replace(/<\/?h[123456]>/gi,"");
        text = this.abbreviate(text);
        this.slideTOC.push([count,level,"<div>"+text+"</div>"]);
      }
    }
    break;
  case "titles":
    text = this.abbreviate(title);
    this.slideTOC.push([count,level,"<div>"+text+"</div>"]);
  }
}

config.macros.slideShow.showSlideFromTOC = function(e) {
  var cm = config.macros.slideShow;
  var slide = parseInt(e.target.getAttribute('slide'));
  $("#toc").hide();
  cm.showSlide(slide);
  return false;
}

config.macros.slideShow.toggleTOC = function(){
  $("#toc").toggle();
  $("#jumpInput").focus().val('');
  return false;
}

config.macros.slideShow.isInteger = function(s){
  for (var i = 0; i < s.length; i++){
    // Check that current character is number
    var c = s.charAt(i);
    if (((c < "0") || (c > "9"))) return false;
  }
  // All characters are numbers
  return true;
}

config.macros.slideShow.jumpToSlide = function(e){
  var cm = config.macros.slideShow;
  if(e.which==13){
    var input= $("#jumpInput").val();
    if(cm.isInteger(input) && input>0 && input<=cm.nSlides){
      $("#toc").hide();
      cm.showSlide(input);
    } else  {$("#jumpInput").val('');}
  }
  return false;
}

config.macros.slideShow.toggleSlideStyles = function(){
  var contentWrapper = $('#contentWrapper');
  if(contentWrapper.hasClass("slideShowMode")){
    refreshPageTemplate();
    removeStyleSheet("SlideShowStyleSheet");
    if(this.theme) removeStyleSheet(this.theme);
  } else {
    $("#displayArea").prepend('<div id="slideBlanker" style="display:none"></div><div id="slideHeader">'+this.header+'</div><div id="slideFooter">'+this.footer+'</div><div id="controlBar"></div>');
    setStylesheet(store.getRecursiveTiddlerText("SlideShowStyleSheet"),"SlideShowStyleSheet");
    if(this.theme && store.tiddlerExists(this.theme)){setStylesheet(store.getRecursiveTiddlerText(this.theme),this.theme);}
    this.buildNavigator();
  }
  contentWrapper.toggleClass("slideShowMode");
  return false;
}

config.macros.slideShow.showSlide = function(n){
  if(this.cycle) {
    if(n>this.nSlides) {
      n = 1;
    } else if(n<1) {
      n = this.nSlides;
    }
  } else {
    if(n>this.nSlides || n<1) return;
  }
  story.closeAllTiddlers();
  if(this.clock=='-'){this.resetClock();}
  story.displayTiddler(null,String(this.slides[n-1]));
  $(".tiddler").attr("ondblclick",null);
  $("body").removeClass("slide"+this.curSlide);
  this.curSlide = n;
  $("body").addClass("slide"+this.curSlide);
  $("#slideCounter").text(this.curSlide+"/"+this.nSlides);
  if(this.overlays){
    var contents = $(".viewer *");
    this.numOverlays = 1;
    while(1){
      if(contents.hasClass(this.text.overlay+this.numOverlays)){
        this.numOverlays++;
      } else {break;}
    }
    this.numOverlays--;
    this.showOverlay(0);
  }
  return false;
}

config.macros.slideShow.showOverlay = function(n){
  var i, set, cm = config.macros.slideShow;
  if(!cm.overlays || cm.numOverlays == 0 || n<0 || n>cm.numOverlays){return;}
  for(i=1; i<n; i++){
    set = $(".viewer "+"."+cm.text.overlay+i);
    set.removeClass("currentOverlay nextOverlay");
    set.addClass("previousOverlay");
  }
  set = $(".viewer "+"."+cm.text.overlay+n);
  set.removeClass("previousOverlay nextOverlay");
  set.addClass("currentOverlay");
  for(i=n; i<config.macros.slideShow.numOverlays; i++){
    set = $(".viewer "+"."+cm.text.overlay+(i+1));
    set.removeClass("previousOverlay currentOverlay");
    set.addClass("nextOverlay");
  }
  cm.curOverlay = n;
}

config.macros.slideShow.firstSlide = function(){
  config.macros.slideShow.showSlide(1);
  return false;
}

config.macros.slideShow.lastSlide = function(){
  config.macros.slideShow.showSlide(config.macros.slideShow.nSlides);
  return false;
}

config.macros.slideShow.next = function(){
  var cm = config.macros.slideShow;
  if(!cm.overlays || cm.numOverlays == 0 || cm.curOverlay == cm.numOverlays) {
    cm.showSlide(cm.curSlide+1);
  } else {
    cm.showOverlay(cm.curOverlay+1);
  }
  return false;
}

config.macros.slideShow.previous = function(){
  var cm = config.macros.slideShow;
  if(!cm.overlays || cm.numOverlays == 0 || cm.curOverlay == 0) {
    cm.showSlide(cm.curSlide-1);
    cm.showOverlay(cm.numOverlays);
  } else {
    cm.showOverlay(cm.curOverlay-1);
  }
  return false;
}

config.macros.slideShow.endSlideShow=function(){
  var cm = config.macros.slideShow;
  if(cm.autoAdvance) {clearInterval(cm.autoAdvance);}
  if(cm.clock) clearInterval(cm.slideClock);
  story.closeAllTiddlers();
  cm.toggleSlideStyles();
  story.displayTiddlers(null,cm.openTiddlers);
  $(document).unbind();
  document.oncontextmenu =  function(){};
  $("body").removeClass("slide"+cm.curSlide);
  return false;
}

// 'keys' code adapted from S5 which in turn was adapted from MozPoint (http://mozpoint.mozdev.org/)
config.macros.slideShow.keys = function(key) {
  var cm = config.macros.slideShow;
  switch(key.which) {
  case 32: // spacebar
    if(cm.auto>0 && cm.blocked==0){
      if(cm.autoAdvance){
        clearInterval(cm.autoAdvance);
        cm.autoAdvance = null;
      } else {
        cm.autoAdvance=setInterval(cm.next, cm.auto*1000);
      }
    } else {
      if(cm.blocked==0) cm.next();
    }
    break;
  case 34: // page down
    if(cm.blocked==0) cm.showSlide(cm.curSlide+1);
    break;
  case 39: // rightkey
    if(cm.blocked==0) cm.next();
    break;
  case 40: // downkey
    if(cm.blocked==0) cm.showOverlay(cm.numOverlays);
    break;
  case 33: // page up
    if(cm.blocked==0) cm.showSlide(cm.curSlide-1);
    break;
  case 37: // leftkey
    if(cm.blocked==0) cm.previous();
    break;
  case 38: // upkey
    if(cm.blocked==0) cm.showOverlay(0);
    break;
  case 36: // home
    if(cm.blocked==0) cm.firstSlide();
    break;
  case 35: // end
    if(cm.blocked==0) cm.lastSlide();
    break;
  case 27: // escape
    cm.endSlideShow();
    break;
  case 66: // B
    $("#slideBlanker").toggle();
    cm.blocked = (cm.blocked +1)%2;
    break;
  }
  return false;
}

config.macros.slideShow.clicker = function(e) {
  var cm = config.macros.slideShow;
  if(cm.blocked==1 || $(e.target).attr('href') || $(e.target).parents().andSelf().hasClass('noClicks')){
    return true;
  }
  if($("#toc").is(':visible')){
    cm.toggleTOC();
  } else {
    if((!e.which && e.button == 1) || e.which == 1) {
      cm.next();
    }
    if((!e.which && e.button == 2) || e.which == 3) {
      cm.previous();
    }
  }
  return false;
}

config.macros.slideShow.setClock = function(){
  var cm = config.macros.slideShow;
  var actualTime = new Date();
  var newTime = actualTime.getTime() - cm.clockStartTime;
  newTime = cm.clockMultiplier*newTime+cm.clockInterval+cm.clockCorrection;
  actualTime.setTime(newTime);
  newTime = actualTime.formatString(cm.clockFormat);
  $("#slideClock").text(newTime);
  return false;
}

config.macros.slideShow.resetClock = function(){
  var cm = config.macros.slideShow;
  if(cm.clock == 0) return;
  var time = new Date(0);
  if(cm.clockStartTime>time){
    var startTime = new Date();
    cm.clockStartTime=startTime.getTime();
  }
  return false;
}

config.shadowTiddlers.SlideShowStyleSheet="/*{{{*/\n.header, #mainMenu, #sidebar, #backstageButton, #backstageArea, .toolbar, .title, .subtitle, .tagging, .tagged, .tagClear, .comment{\n display:none !important\n}\n\n#slideBlanker{\n position: absolute;\n top: 0;\n left: 0;\n width: 100%;\n height: 100%;\n z-index: 90; \n background-color: #000;\n opacity: 0.9;\n filter: alpha(opacity=90)\n}\n\n.nextOverlay{\n visibility: hidden\n}\n\n.previousOverlay,.currentOverlay{\n visibility: visible\n}\n\n#displayArea{\n font-size: 250%;\n margin: 0 !important;\n padding: 0\n}\n\n#controlBar{\n position: fixed;\n bottom: 2px;\n right: 2px;\n width: 100%;\n text-align: right\n}\n\n#controlBar .button{\n margin: 0 0.25em;\n padding: 0 0.25em\n}\n\n#slideHeader{\n font-size: 200%;\n font-weight: bold\n}\n\n#slideFooter{\n position: fixed;\n bottom: 2px\n}\n\n.slideFooterOff #navigator{\n visibility: hidden\n}\n\n#slideClock{\n margin: 0 5px 0 5px\n}\n\n#slideCounter{\n cursor: pointer;\n color: #aaa\n}\n\n#toc{\n display: none;\n position: absolute;\n font-size: .75em;\n bottom: 2em;\n right: 0;\n background: #fff;\n border: 1px solid #000;\n text-align: left\n}\n\n#jumpItem{\n padding-left:0.25em\n}\n\n#jumpInput{\n margin-left: 0.25em;\n width: 3em\n}\n\n.tocLevel1{\n font-size: .8em\n}\n\n.tocLevel2{\n margin-left: 1em;\n font-size: .75em\n}\n\n.tocLevel3{\n margin-left: 2em;\n font-size: .7em\n}\n\n.tocLevel4{\n margin-left: 3em;\n font-size: .65em\n}\n\n.tocLevel5{\n margin-left: 4em;\n font-size: .6em\n}\n\n.tocLevel6{\n margin-left: 5em;\n font-size: .55em\n}\n/*}}}*/";

config.shadowTiddlers.SlideShowPluginDoc="The documentation is available [[here|http://www.math.ist.utl.pt/~psoares/addons.html#SlideShowPluginDoc]].";
})(jQuery)
}
//}}}