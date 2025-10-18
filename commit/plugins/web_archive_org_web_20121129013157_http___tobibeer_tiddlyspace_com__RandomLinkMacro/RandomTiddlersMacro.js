/***
|''Name''|RandomTiddlersMacro|
|''Description''|returns a list of x out of y random tiddlers, optionally...<br>-> having a certain tag<br>-> returning a tiddler section, slice or field value|
|''Author''|Tobias Beer|
|''Version''|1.0.4 (2012-07-14)|
|''Source''|http://randomtiddlers.tiddlyspace.com/#RandomTiddlersMacro|
|''Documentation''|http://tobibeer.tiddlyspace.com/#RandomTiddlers|
|''License''|[[Creative Commons Attribution-Share Alike 3.0|http://creativecommons.org/licenses/by-sa/3.0/]]|
|''~CoreVersion''|2.2|
!Usage
{{{<<randomTiddlers config>>}}}
!Example
<<randomTiddlers RandomTiddlersConfig>>
!Code
***/
/*{{{*/
config.macros.randomTiddlers={config:"RandomTiddlersConfig",txtConfirm1:"Please provide a name for the output tiddler:",txtConfirm2:'The tiddler "%0" already exists! Please provide another name for the output tiddler or enter "YES" to overwrite the tiddler "%0":',txtSavedTo:"The following list was saved to tiddler [[%0]]%1...\n",txtOpenStory:" (<<openStory [[%0]]>>)",txtAbortAt:"YES",txtNoConfig:'@@color:red;The configuration tiddler called "%0" could not be found!@@',handler:function(a,b,c,d,e,f){var g=c[0]||this.config;if(!store.getTiddler(g)){wikify(this.txtNoConfig.format([g]),a);return}var h=[],i,j=0,k=0,l="",m,n,o,p,q,r,s=[],t,u=parseInt(store.getTiddlerText(g+"::max"))||10,v=parseInt(store.getTiddlerText(g+"::sample"))||50,w=store.getTiddlerText(g+"::tagged"),x=store.getTiddlerText(g+"::exclude"),y=store.getTiddlerText(g+"::content"),z=store.getTiddlerText(g+"::type"),A=store.getTiddlerText(g+"::required")=="yes",B=store.getTiddlerText(g+"::saveTo"),C=store.getTiddlerText(g+"::saveWithTags")||"",D=store.getTiddlerText(g+"::sort"),E=store.getTiddlerText(g+"::dateformat"),F=store.getTiddlerText(g),G=store.getTiddlers(D);if(w)w=w.readBracketedList();if(x)x=x.readBracketedList();m=F.indexOf("!Template\n");F=F.substr(m+10)+"\n";if(F.substr(0,4)=="{{{\n"&&F.substr(F.length-5,4)=="\n}}}"){F=F.substr(3,F.length-8)}z=z?z.toLowerCase():"";z=z=="field"?"f":z=="slice"?"::":"##";if(!w)h=G;else{n=G.length;while(n>0){n--;p=G[n];q=p.tags;if(q&&q.containsAny(w)&&(!x||!q.containsAny(x))){if(z=="f")r=store.getValue(p,y);else r=store.getTiddlerText(p.title+z+y);if(!A||A&&r){h.push(G[n]);s[p.title]=r;j++}}if(j>=v)break}}while(h.length>0&&k<u){k++;j=Math.floor(Math.random()*h.length);i=h[j][D].formatString(E);l+=F.format([h[j].title,y,s[h[j].title],i,h[j].modifier,h[j].tags],k);h.splice(j,1)}l=l.substr(1);if(B){o=prompt(this.txtConfirm1,B);if(o&&o!=B){while(store.getTiddler(o)&&o!=this.txtAbortAt){t=o;o=prompt(this.txtConfirm2.format([o]))}}if(o==this.txtAbortAt)o=t;if(o){store.saveTiddler(o,o,l,config.options.txtUserName,new Date,C.readBracketedList(),merge({},config.defaultCustomFields));wikify(this.txtSavedTo.format([o,config.macros.openStory?this.txtOpenStory.format([o]):""]),a);if(config.options.chkAutoSave)autoSaveChanges(null,[o]);}}wikify(l,a)}}
/*}}}*/