// jscalc code
// credits: http://www.themaninblue.com/experiment/JSCalc/
function JSC(){
	var d=document;var b=d.getElementsByTagName('body')[0];var dv=d.createElement('div');
	dv.id = "calc";	dv.style.opacity=0.95;dv2=d.createElement('div');dv2.id = "cacltitle";
	var inp=d.createElement('input');var an=d.createElement('a');b.appendChild(dv);
	an.appendChild(d.createTextNode('JSCalc'));dv2.appendChild(an);b.appendChild(dv2);
	an.setAttribute('href','http://www.themaninblue.com/experiment/JSCalc/');
	inp.type='text';dv.appendChild(inp);va(inp,60);inp.focus();
	inp.onkeypress=function(e){
		var t=this;var a=false;
		var ak=[8,13,32,37,39,40,41,42,43,45,46,47,48,49,50,51,52,53,54,55,56,57,106,107,109,111,120,190,191];
		var ck=[8,13,32,37,39,40,41,42,43,45,47,106,107,109,111,120,190,191];
		if(!e){e=event;}
		for(var i=0;i<ak.length;i++){if(e.keyCode==ak[i]||e.charCode==ak[i]){a=true;}}
		if(a){
			if(t.c){
				a=false;
				for(var i=0;i<ck.length;i++){if(e.keyCode==ck[i]||e.charCode==ck[i]){a=true;}}
				if(!a){t.value='';va(t,60);}
			}
			t.c=false;
			if(e.keyCode=='13'||e.charCode=='13'){
				var c=t.value;c=c.replace(/x/g,'*');c=eval(c);
				if(c!=null){
					c=c.toString();
					if(c.length<9){va(t,60);
					}else{if(c.length>9){	c=c.substring(0,14);}va(t,30);}
					t.value=c;
					t.c=true;
				}
			} else if(e.keyCode!=8&&e.keyCode!=13){
				if(t.value.length==8){va(t,30)} else if(t.value.length>15){return false;}
			} else if(t.value.length==9){va(t,60)}
		} else {return false;}
		return true;
	}

	inp.onblur=function(e){op(this.parentNode);}
}
function op(t){
var o=parseFloat(t.style.opacity);
if(o<0.08){t.parentNode.removeChild(t.nextSibling);t.parentNode.removeChild(t);}
 else {	o -= 0.07;t.style.opacity=o;t.nextSibling.style.opacity=o;setTimeout(function(){ op(t); },50);}
return true;
}
function va(t,f){
m=document.documentElement.scrollTop+window.innerHeight/2+'px';
t.parentNode.style.top=m;t.parentNode.nextSibling.style.top=m;
t.style.fontSize=f+'px';t.style.marginTop=-parseInt(t.clientHeight/2)+'px';
return true;
}
//-- add calc macro
version.extensions.calc= {major: 0, minor: 1, revision: 0};
config.macros.calc = {
	text: "Calculator",
	tip: "Start a simple calculator",
	handler: function(place,macroName,params) {createTiddlyButton(place,this.text,this.tip,JSC);}
};
