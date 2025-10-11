/***
|''Name:''|SimpleRolesPlugin|
|''Description:''|provides a simple user management system|
|''Author:''|[[Tobias Beer]]|
|''Version:''|1.1.0 (2010-10-16)|
|''Source:''|http://tobibeer.tiddlyspace.com/#SimpleRolesPlugin|
|''Documentation:''|http://tobibeer.tiddlyspace.com/#SimpleRoles|
|''Readable code:''|http://bit.ly/apnRUh|
|''~TiddlyWiki:''|Version 2.5 or better|
/%***/
config.macros.simpleroles={def:"SimpleRolesConfig",roles:["Admin","PowerUser","User"],defaultRole:"Guest",variableName:"simpleRoles",fmtInfo:"%0 (%1)",errGroup:'Error in SimpleRolesPlugin: User group "%0" not found in "%1"!',handler:function(h,d,g,k,f,l){var n,e,a,j,b,m=this.variableName,c=this.roles,p=g[0],o=g[1],i=config.options.txtUserName;if(!f||!window[m]){window[m]=[this.defaultRole];for(a=0;a<c.length;a++){j=c[a];b=store.getTiddlerText(this.def+"##"+j);if(!b){alert(this.errGroup.format(j,this.def));break}if(b.readBracketedList().contains(i)){c.splice(0,a);window[m]=c;break}}}if(!p){return}if(p=="info"){if(!o){o=this.fmtInfo}wikify(o.format(i,window[m][0]),h)}else{e=p.indexOf("!")==0;if(e){p=p.substr(1)}n=window[m].contains(p);n=n&&!e||e&&!n;if(n){if(o){wikify(o.indexOf("tiddler:")==0?store.getTiddlerText(o.substr(8)):o,h)}}else{removeChildren(h);h.parentNode.removeChild(h)}}}};
//%/