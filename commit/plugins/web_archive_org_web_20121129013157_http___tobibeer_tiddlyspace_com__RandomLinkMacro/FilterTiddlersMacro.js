/***
|''Name:''|FilterTiddlersMacro|
|''Description:''|provides a interactive tiddler filtering by date range, tags or modifers|
|''Author:''|[[Tobias Beer]]|
|''Version:''|1.0.2 (2010-09-27)|
|''Source:''|http://filtertiddlers.tiddlyspace.com/#FilterTiddlersMacro|
|''Documentation:''|http://tobibeer.tiddlyspace.com/#FilterTiddlers|
|''~TiddlyWiki:''|Version 2.5 or better|
***/
//{{{
(function($){

config.macros.filtertiddlers = {

//OPTIONS
exclude:'excludeLists',
sortField:'-modified',
showDates:true,
showUsers:false,
showCount:true,
showLabels:true,

//OUTPUT FORMAT
fmtHeaderCount:'%0',
fmtHeaderField:'%0',
fmtHeader:'!Filter results',
fmtItem:'\n*%modified: @@padding-left:5px;%hastags@@ %tags',
fmtCount:'',
fmtField:'%0',
fmtDate:'YYYY-0MM-0DD',
fmtYear:'YYYY',
fmtMonth:'mmm',
fmtTags:'@@padding-left:20px;color:#666; ...tags: %0@@',
fmtTag:'<<tag [[%0]]>>',
fmtTagSeparator:'',

//LOCALISATION
txtSel:'select ',
txtSet:'set or unset filter for ',
txtTag:'tag: ',
txtUser:'user: ',
txtYear:'year: ',
txtMonth:'month: ',

//DO NOT EDIT
handler:function (place, macroName, params, wikifier, paramString, tiddler) {
	var count,dates,f0,f1,fd,fi,fc,fch,ff,ffh,fm,ft,fts,fy,lbl,tags,sep,sf,tags,users,
		fx=config.macros.filtertiddlers,
		p=paramString.parseParams(null,null,true),
		tpl=getParam(p,'template','');
	[
	['count','showCount'],
	['dates','showDates'],
	['users','showUsers'],
	['lbl','showLabels'],
	['f0','fmtHeader'],
	['f1','fmtItem'],
	['fc','fmtCount'],
	['fch','fmtHeaderCount'],
	['fd','fmtDate'],
	['ff','fmtField'],
	['ffh','fmtHeaderField'],
	['fy','fmtYear'],
	['fm','fmtMonth'],
	['ft','fmtTag'],
	['fts','fmtTags'],
	['sep','fmtTagSeparator'],
	['sf','sortField'],
	['tags','tags'],
	['fi','field']
	].map(
		function(f){
			var c='fx.'+f[1],l,p,s,sl,sls,v;
			if(tpl){
				eval(f[0]+'=('+c+'?'+c+':"");');
				sls=store.getTiddlerText(tpl,'').split('\n');
				for(s=0;s<sls.length;s++){
					sl=sls[s];
					p=sl.indexOf(':');
					v=sl.substr(p+1);
					sl=sl.substr(0,p);
					if(sl==f[1]){
						eval(f[0]+'=\''+v+'\';');
						break;
					}
				}
			}else eval(f[0]+'=getParam(p,"'+f[1]+'",('+c+'?'+c+':""));');
		}
	);
	lbl=(lbl?lbl.toString():'')=='true';
	setLbl=function(el,txt){if(lbl)createTiddlyElement(el,'strong',null,null,txt);}

	var b,ex,f,filbl,isDate,lst,m,mo,ms=[],rev,sf,t,ts=[],tids=[],tgs,x,y,
		d=new Date(),
		id='tl'+d.formatString('YYYYMMDDhhmmss')+Math.random().toString().substr(6),
		rev=sf.indexOf('-')==0,
		sf=rev?sf.substr(1):sf,
		ts=store.getTiddlers(sf),
		isDate=fx.isDate(ts?ts[0][sf]:''),
		yMin=isDate?(ts[rev?0:ts.length-1][sf].getYear()+1900):null,
		yMax=isDate?(ts[rev?ts.length-1:0][sf].getYear()+1900):null;

	f=createTiddlyElement(place,'div',null,'tlfilter');
	fi==fi.split('|');
	if(fi[1]){filbl=fi[0];fi=fi[1];}else filbl=fi;
	
	x=ex=(getParam(p,'exclude','')+' '+fx.exclude).readBracketedList();
	store.forEachTiddler(function(tw,t){if(t.tags.containsAny(x))ex.pushUnique(t.title);});

	if(tags.substr(0,8).toUpperCase()=='TIDDLER:')tags=store.getTiddlerText(tags.substr(8));
	if(tags){
		ts=[];
		tgs=tags.readBracketedList().sort();
		tgs.map(function(t){if(!ex.contains(t))ts.push(t);});
		if(ts.length>0){
			var fltGroup=createTiddlyElement(f,'div');
			setLbl(fltGroup,fx.txtTag);
			for(t=0;t<ts.length;t++){
				$(createTiddlyButton(fltGroup,ts[t],fx.txtSet+fx.txtTag+ts[t],fx.filter,'button tltag')).attr({'target':id,'tag':ts[t]});
			}
		}		
	}

	users=users.toString()=='true';
	if(users){
		store.forEachTiddler(function(tw,t){ms.pushUnique(t.modifier);});
		ms.sort();
		var fltGroup=createTiddlyElement(f,'div');
		setLbl(fltGroup,fx.txtUser);
		for(m=0;m<ms.length;m++){
			$(createTiddlyButton(fltGroup,ms[m],fx.txtSet+fx.txtUser+ms[m],fx.filter,'button tluser')).attr({'target':id,'user':ms[m]});
		}
	}

	dates=isDate&&dates.toString()=='true';
	if(dates){
		var fltGroup=createTiddlyElement(f,'div');
		setLbl(fltGroup,fx.txtYear);
		for(y=yMax;y>=yMin;y--){
			yr=new Date(y+'/01/01 00:00:00').formatString(fy);
			$(createTiddlyButton(fltGroup,yr,fx.txtSel+fx.txtYear+yr,fx.filter,'button tlyear')).attr({'target':id,'year':y});
		}
		var fltGroup=createTiddlyElement(f,'div')
		setLbl(fltGroup,fx.txtMonth);
		for(m=1;m<13;m++){
			mo=new Date('2000/'+String.zeroPad(m,2)+'/01 00:00:00').formatString(fm);
			$(createTiddlyButton(fltGroup,mo,fx.txtSel+fx.txtMonth+mo,fx.filter,'button tlmonth')).attr({'target':id,'month':m});
		}
	}else if(!isDate){
		var fltGroup=createTiddlyElement(f,'div');
		setLbl(fltGroup,sf+': ');
		ts=[];
		store.getTiddlers(sf).map(function(t){ts.pushUnique(store.getValue(t.title,sf));});
		ts.sort();
		for(t=0;t<ts.length;t++){
			f=ts[t];
			b=$(createTiddlyButton(fltGroup,f,fx.txtSet+f,fx.filter,'button tl'+sf)).attr('target',id);
			b.attr(sf,f);
		}
	}

	lst=$(createTiddlyElement(place,'div',id,'tllist'));
	lst.attr('exclude','[['+ex.join(']] [[')+']]');
	['count','dates','f0','f1','fd','fc','fch','ff','ffh','fi','filbl','fm','ft','fts','fy','rev','sep','sf','tags','users'].map(
		function(t){eval('lst.attr("'+t+'",'+t+')');}
	);

	this.filter(id);
},

filter:function(id){
	var a,b,clk,d,dEnd,dt,el,ev,ex,fi,filbl,fs,hd,
	n=0,out='',sfv,sk,sTags,t,tid,tag,tags,ts,v,val,usr,
	fx=config.macros.filtertiddlers,
	m0=m1=new Date().getMonth()+1,y0=y1=new Date().getYear()+1900;
	if(this.innerHTML){
		ev=id||window.event;
		id=$(this).attr('target');
	}
	el=$('#'+id);
	var f0,f1,fc,fch,fd,ff,ffh,fm,ft,fts,fy,sep,sf,count,dates,rev,tags,users;
	['f0','f1','fc','fch','fd','ff','ffh','fm','ft','fts','fy','sep','sf','=count','=dates','=rev','=users'].map(
		function(t){var b=t.substr(0,1)=='=';if(b)t=t.substr(1);eval(t+'=el.attr("'+t+'")'+(b?'=="true";':';'))}
	);
	tags=tags?tags.readBracketedList():[];
	ts=store.getTiddlers(sf);
	a=$(this).attr('year')||$(this).attr('month')||$(this).attr('user')||$(this).attr('tag')||$(this).attr(sf);
	if(a){
		if($(this).attr(sf)){
			el.attr(sf,el.attr(sf)==a?'':a);
		}else if(users&&$(this).attr('user')){
			el.attr('user',el.attr('user')==a?'':a);
		}else if(tags&&$(this).attr('tag')){
			el.attr('tag',el.attr('tag')==a?'':a);
		}else if(dates){
			sk=ev.shiftKey;
			if(a.length==4){
				if(sk){
					v=el.attr('yX');v=v?v:y0;
					b=parseInt(a)<parseInt(v);
					el.attr({'y0':b?a:v,'y1':b?v:a});
				}else el.attr({'yX':a,'y0':a,'y1':a});
				if(!ev.ctrlKey)el.attr({'mX':1,'m0':1,'m1':12});
			}else{
				if(sk){
					v=el.attr('mX');v=v?v:m0;
					b=parseInt(a)<parseInt(v);
					el.attr({'m0':b?a:v,'m1':b?v:a});
				}else el.attr({'m0':a,'m1':a,'mX':a});
			}
		}
	}
	v=el.attr('m0');m0=v?v:m0;
	v=el.attr('m1');m1=v?v:m1;
	v=el.attr('y0');y0=v?v:y0;
	v=el.attr('y1');y1=v?v:y1;
	usr=el.attr('user');
	tag=el.attr('tag');
	fi=el.attr('fi');
	filbl=el.attr('filbl');
	sfv=el.attr(sf);
	ex=(el.attr('exclude')).readBracketedList();
	for(t=rev?ts.length-1:0;rev?t>=0:t<ts.length;rev?t--:t++){
		tid=ts[t];
		val=fi?(tid[fi]?tid[fi]:store.getValue(tid.title,fi.toLowerCase())):'';
		if(tid.tags.containsAny(ex)||
			sfv&&sfv!=store.getValue(tid.title,sf.toLowerCase())||
			fi&&!val||
			tag&&!tid.tags.contains(tag)||
			tags.length&&!tid.tags.containsAny(tags)||
			users&&usr&&tid.modifier!=usr)continue;
		d=tid[sf]?tid[sf]:store.getValue(tid.title,sf);
		if(fx.isDate(d))dt=String.zeroPad(d.getDate(),2);
		if(!dates||fx.inRange(d,m0,m1,y0,y1)){
			sTags=tid.tags&&tid.tags.length>0?fts.format([
				tid.tags.length==1?ft.format([tid.tags[0]]):tid.tags.map(
					function(t,n){return ft.format([t]);}
				).join(sep)
			]):'';
			n++;
			out+=f1.replace(/%nl/mg,'\n'
				).replace(/%title/mg,'[['+tid.title+']]'
				).replace(/%modifier/mg,tid.modifier
				).replace(/%modified/mg,tid.modified.formatString(fd)
				).replace(/%created/mg,tid.created.formatString(fd)
				).replace(/%sortfield/mg,dates||fx.isDate(d)?d.formatString(fd):d
				).replace(/%tags/mg,sTags
				).replace(/%hastags/mg,store.getTaggedTiddlers(tid.title).length>0?'<<tag '+tid.title+'>>':'[['+tid.title+']]'
				).replace(/%field/mg,fi?ff.format([fx.isDate(val)?(new Date(val).formatString(fd)):val]):''
				).replace(/%count/mg,count?fc.format([n]):'');
		}
	}

	fs=el.previousSibling;
	[
		['year',true,'y0<=v&&v<=y1'],
		['month',true,'m0<=v&&v<=m1'],
		['user',false,'!usr||usr==v'],
		['tag',false,'!tag||tag==v'],
		[sf,false,'!sfv||sfv==v']
	].map(
		function(s){
			eval('fx.select($(".tl'+s[0]+'",fs),"'+s[0]+'","'+(s[1]?'parseInt(%0)':'\'%0\'')+'",function(v){return '+s[2]+'});');
		}
	);

	el.empty();
	if(out){
		hd=f0.replace(/%field/mg,fi?ffh.format([filbl]):''
			).replace(/%count/mg,count?fch:''
			).replace(/%sortfield/mg,sf);
		wikify(hd+out,el[0]);
	}
	if(config.tableSorting&&config.tableSorting.refresh)config.tableSorting.refresh(el[0].parentNode);
	return false;
},

inRange:function(d,m0,m1,y0,y1){
	var y,dInM=32-new Date(y1,m1+1,32).getDate();
	for(y=y0;y<=y1;y++){
		if(this.getDate(y,m0,1)<=d&&(d<=this.getDate(y,m1,dInM,true)))return true;
	}
	return false;
},

getDate:function(y,m,d,e){
	return new Date(y+'/'+String.zeroPad(m,2)+'/'+String.zeroPad(d,2)+(e?' 23:59:59':' 00:00:00'));
},

isDate:function(d){
	return new Date(d)!='Invalid Date';
},

select:function(els,a,ev,chk){
	els.each(function(){
		var v=$(this).attr(a);
		v=eval(ev.format([v]));
		if(chk(v))addClass(this,'tlSelect'); else removeClass(this,'tlSelect');
	});
}
}

config.shadowTiddlers.StyleSheetFilterTimeLine =
	'.tlfilter{display:block;}\n'+
	'.tlfilter div{display:block;width:100%;padding:0.2em 0;clear:left;vertical-align:middle;}\n'+
	'.tlfilter strong{display:block;float:left;width:100px;text-align:right;padding:0.2em 0.4em 0.2em 0;}\n'+
	'.tlfilter .button{display:block;float:left;margin:0 0.1em;padding:0.2em 0.4em;-moz-border-radius:7px;border-radius:7px;}\n'+
	'.tlfilter .tlSelect{background:#FE8 !important;}\n'+
	'.tllist {clear:left;padding-top:1px;}'+
	'.tllist ul {list-style-type:none;}'+
	'.tllist ul,.tllist ol {margin-left:0;padding-left:0em;list-style-position:inside;}'+
	'.tllist ul li,.tllist ol li {border-bottom:1px solid #eee;margin-bottom:3px;padding-left:0.5em;}';
store.addNotification("StyleSheetFilterTimeLine", refreshStyles);

})(jQuery);
//}}}