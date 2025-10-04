/***
|''Name:''|BulletGraphMacro|
|''Description:''|provides an inline bullet graph|
|''Author:''|[[Tobias Beer]]|
|''Version:''|1.0.0 (2010-09-23)|
|''Source:''|http://bulletgraph.tiddlyspace.com/#BulletGraphMacro|
|''Documentation:''|http://tobibeer.tiddlyspace.com/#BulletGraph|
|''~TiddlyWiki:''|Version 2.5 or better|
!Example
{{{<<bulletgraph 75 85 scales:50,70,90,100>>}}}
<<bulletgraph 75 85 scales:50,70,90,100>>
!Code
***/
//{{{
config.macros.bulletgraph = {

	//CONFIGURATION OPTIONS
	defaultLabels:true,
	fmtTitle:'current = %0 / target = %1',
	fmtScales:' / scales=%0',
	widthGraph:200,
	widthTarget:3,

	handler:function (place, macroName, params, wikifier, paramString, tiddler) {
		var el,p=paramString.parseParams(null,null,true),
			val=parseInt(params[0]),
			tgt=parseInt(params[1]),
			scales=getParam(p,'scales',''),
			lbl=getParam(p,'labels',this.defaultLabels.toString())=='true';
		scales=scales?scales.split(','):null;
		if(lbl)wikify('0',place);
		var	end=scales?parseInt(scales[scales.length-1]):tgt,
			lvl=scales?scales.length:0,
			g=createTiddlyElement(place,"div",null,"hBullet");
		g.style.width=this.widthGraph+'px';
		end=tgt>end?tgt:end;
		var pct=val/end;
		while(lvl>0){
			lvl--;
			createTiddlyElement(g,"div",null,'hBulletScale hBulletLevel'+lvl).style.width=parseInt(scales[lvl])/end*100 + '%';
		}
		createTiddlyElement(g,"div",null,'hBulletVal').style.width=pct*100 + '%';
		if(scales){
			el=createTiddlyElement(g,"div",null,'hBulletTgt');
			el.style.left=tgt/end*100-this.widthTarget/2/this.widthGraph + '%';
			el.style.width=this.widthTarget+'px';
		}
		g.setAttribute('title',this.fmtTitle.format([val,tgt])+(scales?this.fmtScales.format([scales.toString()]):''));
		if(lbl)wikify(end.toString(),place);
	}
},

//STYLESHEET DEFINITIONS
config.shadowTiddlers.StyleSheetBulletGraph =
	'.hBullet {display:block;display:inline-block;position:relative;clear:none;background:#DDD;'+
		'border:1px solid #999;margin:0 0.3em -0.3em 0.3em;height:1.2em;}\n'+
	'.hBullet div {position:absolute;}\n'+
	'.hBulletScale {float:left;height:100%;top:0;}\n'+
	'.hBulletLevel0 {background:#777;}\n'+
	'.hBulletLevel1 {background:#999;}\n'+
	'.hBulletLevel2 {background:#BBB;}\n'+
	'.hBulletLevel3 {background:#DDD;}\n'+
	'.hBulletVal {border-bottom: 0.3em solid #006;height: 0.5em;}\n'+
	'.hBulletTgt {background: #006;height: 0.8em;top: 0.25em;-moz-border-radius:2px;border-radius:2px;}';
store.addNotification("StyleSheetBulletGraph", refreshStyles);
//}}}