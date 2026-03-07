/***
|''Name''|ListrPlugin|
|''Description''|(Check-)list management made simple|
|''Author''|Tobias Beer|
|''Version''|0.9.0|
|''Status''|pre alpha|
|''Source''|http://tobibeer.tiddlyspace.com/#ListrPlugin|
|''Documentation''|http://tobibeer.tiddlyspace.com/#Listr|
|''License''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''~CoreVersion''|2.5.3|
|''Type''|plugin|
!Code
***/
//{{{

(function($){

config.macros.listr={

//OPTIONS
itemTag:'listr',
doneTag:'done',
refTag:'reference',
askAdd:false,
askDelete1:true,
askDeleteAll:true,
openClick:false,
autoSave:false,
tagToList:true,
timeStamp:true,
focusInput:true,
hideTagInList:true,
lockedOnReadOnly:true,
fmtTimeStamp:'YYYY.0MM.0DD-0hh.0mm.0ss',
height:'2.5em', //make '' to expand fully or '0' to only show title
fmtTag:'<<tag [[%0]]>>',
fmtTitle:'[[%0]]',
newListText:'<<listr>>',
gotoOptions:'quiet',

//LOCALISATION
errListr:"@@color:red;''Error Listr:'' %0@@",
errTid:"Could not find tiddler '%0'!",
errTitle:"Please enter an item title!",
errNum:"Numbers please!",

msgOpen:"Item already exists! Open?",
msgNoneDone:"Nothing to be deleted.",
msgAdd:"This will add '%0' to the list. Proceed?",
msgDelete1:"Really delete item '%0'?",
msgDeleteAll:"Really delete all these %0 done items?\n\n%1",
msgDeleteList:"There are still %0 items associated with this listr list.\n\n"+
	"Type OK if you want to delete them as well.\n"+
	"Type REF if you want to keep them as references.\n\n"+
	"Otherwise leave the prompt unchanged.",
msgDeleteTid:"Just delete this tiddler...",
msgOpenTid:"Open the tiddler...",
msgExists:"A tiddler by that name already exists!\n\n"+
	"Type OK if you want to overwrite it.\n"+
	"Leave the prompt unchanged to open the tiddler.\n\n"+
	"Otherwise just cancel.",

lblNoTags:"@@padding-right:10px;@@",
lblRefresh:"Click to refresh, when changed outside...",
lblDone:"mark done (CTRL+CLICK to delete)",
lblUndone:"put back into the list",
lblOpen:" (click to open)",
lblDoneItem:"CTRL+CLICK to mark item done",
lblUnDoneItem:"CTRL+CLICK to put item back into the list",
lblClick:"click to ",
lblShowDone:"show done items »",
lblHideDone:"hide done items «",
lblDelete1:"permanently delete this done item / CTRL+CLICK to keep as reference",
lblDeleteAll:"permanently delete all done items",
lblOrder:"Enter a new number to reorder this item",
lblTimeStamp:"item title (if blank, a timestamp will be used ...like this: '%0')",
lblEdit:"Click to edit / %0",
lblEditOut:"When done, click OK or (CTRL-) ENTER to save changes or hit ESCAPE to leave edit mode)",
lblEditTITLE:"Edit item title. ",
lblEditTAGS:"Edit item tags. ",
lblEditTEXT:"Edit item text. ",
btnAdd:"add new items »",
lblAdd:"Click to add new items",
btnOk:"Click to save changes",
lblOk:"ok",
lblEditOk:"Click '%0' to save changes or use ENTER in title or tags or CTRL+Enter in textbox",
lbltitle:'title',
lbltext:'text',
lbltags:'tags',
lblselect:'select',

handler:function (place, macroName, params, wikifier, paramString, tiddler)
{
	var add,btn,el,f,ins,out,
		tid=tiddler.title,
		lr=config.macros.listr,
		id='lr'+(new Date).convertToYYYYMMDDHHMMSSMMM(),
		p=paramString.parseParams(null,null,true),
		h=getParam(p,'height',lr.height),
		ttl=getParam(p,'tagToList',lr.tagToList.toString())=='true',
		ts=getParam(p,'timeStamp',lr.timeStamp.toString())=='true',
		focus=getParam(p,'focus',lr.focusInput.toString()),
		gtops=getParam(p,'gotoOptions',lr.gotoOptions),
		stid=getParam(p,'tiddler',''),
		one=stid!='',
		orph=params.contains('orphans'),
		lst=getParam(p,'list',tid),
		addtgs=getParam(p,'addTags',''),
		notags=params.contains('notags'),
		edit=params.contains('edit'),
		lock=one||params.contains('locked')||params.contains('lockedOnReadOnly')&&readOnly;

	out=createTiddlyElement(place,'div',id,'lr_list');
	$(out).attr({
		tiddler:tid,
		tagtolist:ttl,
		lr_list:lst,
		height:h,
		addtgs:addtgs,
		lock:lock,
		edit:edit,
		focus:focus,
		orph:orph.toString(),
		one:stid,
		ts:ts
	});

	//Single tid not found
	if(one&&!store.getTiddler(stid)){
		lr.error(lr,lr.errTid.format([stid]),out);
		return;
	}

//UNLOCK HEADER
	if(!lock)
	{
	wikify(
	store.getTiddlerText('ListrPlugin##HEADER').format([
		id,
		store.getTiddlerText('ListrPlugin##NEWLIST').format([lr.itemTag])
	]),
	out
	);
//alert(store.getTiddlerText('ListrPlugin##HEADER'));

	el=$('.lr_head:last',out)[0];
	btn=createTiddlyButton(
		el,
		this.btnAdd,
		this.lblAdd,
		function(){
			var el=$(this),
				app=el.closest('.lr_list');
				sl=el.next(),
				show=sl.css('display')=='none';
			if(show){
				sl.fadeIn();
				$('.lr_add .lr_input',sl).val('').first().focus();
				$('.lr_add input[name|=addtags]',sl).val(app.attr('addtgs'));
			}else sl.fadeOut();
		},
		'lr_addbtn button'
	);
	wikify(
		store.getTiddlerText('ListrPlugin##ADDFORM'),
		createTiddlyElement(el,'div',null,'sliderPanel')
	);

	add=$('.lr_add:last',out);
	//GoTo Plugin Integration
	if(config.macros.gotoTiddler){
		el=createTiddlyElement(place,"form");
		$(el).css({display:'inline'}).attr({name:'gototitle'});
		$($('.lr_input',add)[0]).before($(el)).remove();
		wikify('<<gotoTiddler '+gtops+' >>',el);
		el=$('input',el
		).addClass('lr_input'
		).attr({
			notify:'config.macros.listr.gotoTitle'
		});
	}
	$('.lr_refresh',out).click(lr.update).attr({title:lr.lblRefresh,mode:'refresh'});
	$('.lr_submit',add).click(lr.update).attr({mode:'add'});
	f=function(ev){
		var e=ev||window.event,
			txt=$(this).attr('name')=='addtext';

		if(e.keyCode==27){
			$(this).closest('.sliderPanel').fadeOut();
			return true;
		}
		if(txt&&e.keyCode==9&&e.shiftKey){
			$(this).closest('.lr_head').find('input[name|=tags]').focus();
			lr.noBubble(e);
		}
		if(e.keyCode==13&&(!txt||e.ctrlKey)){
			lr.update(this);
			lr.noBubble(e);
		}
	}
	ins=$('.lr_input',out).attr({mode:'add'});
	window.event?ins.keydown(f):ins.keypress(f);
	}
//END UNLOCK HEADER

	createTiddlyElement(out,'div',null,'lr_items');

//UNLOCK FOOTER
	if(!lock)
	{
	wikify(store.getTiddlerText('ListrPlugin##DONE').format([id]),out);
	$('.lr_deleteall',out).click(lr.update).attr({
		title:lr.lblDeleteAll,
		mode:'deleteall'
	});
	$('.lr_donebtn',out
		).click(lr.update
		).attr({title:lr.lblClick+lr.lblShowDone,mode:'donebtn',show:'true'}
		).html(lr.lblShowDone);
	};
//END UNLOCK FOOTER

	wikify('{{lr_clr{}}}',out);
	this.update(out);
},

update:function(el)
{
	var all=dirty=true,bin,dn,dsc,item,ls,mode,mv,num,s,show,tit,tr,x=[],
		lr=config.macros.listr,
		ev=el||window.event,
		tgt=ev.nodeName?null:resolveTarget(ev),
		btn=$(el).attr('mode')?$(el):$(this),
		item=btn.attr('item'),
		lr_item=btn.closest('.lr_item'),
		tmp=lr_item.attr('tmpMode'),
		mode=tmp?tmp:btn.attr('mode'),
		t=store.getTiddler(item),
		app=$(mode?btn:el).closest('.lr_list'),
		lock=app.attr('lock')=='true',
		lr_st=$('.lr_items',app),
		add=lock?null:$('.lr_add',app)[0],
		inp=add.gototitle?add.gototitle.gotoTiddler:add.addtitle,
		bin=$('.lr_done',app),
		onlyBin=false,
		show=$('.lr_donebtn',app).attr('show')=='true',
		lst=app.attr('lr_list'),
		dt=app.attr('ts')=='true'?lr.stamp(lr):null;

	switch (mode) {
  case "add":
		tit=inp.value;
		if($(add).attr('update')!='true'&&store.getTiddler(tit)){
			if(confirm(lr.msgOpen))story.displayTiddler(null,tit);
			return false;
		}
		if(!tit){
			if(dt)tit=dt;
			else{alert(lr.errTitle);return false;}
		}
		store.saveTiddler(
			tit,
			tit,
			add.addtext.value,
			config.options.txtUserName,
			new Date(),
			((app.attr('tagtolist')=='true'?'[['+app.attr('tiddler')+']]':'')+'[['+lr.itemTag+']] '+add.addtags.value).readBracketedList(),
			merge({'lr_list':lst},config.defaultCustomFields)
		);
		inp.value='';
		add.addtext.value='';
		$(add).attr('update','');
		break;
	case 'doneitem':
		if(!ev.ctrlKey){
			return lr.itemClick(lr,lr_item,tgt);
		}
	case 'done':
		all=false;
		if(mode=='done'&&ev.ctrlKey){
			lr_item.attr('tmpMode','delete');
			btn.click();
			return false;
		}
		lr_item.fadeOut(400);
		store.setTiddlerTag(item,false,lr.itemTag);
		store.setTiddlerTag(item,true,lr.doneTag);
		if(!show)lr.renderItem(app,bin[0],t,true);
		break;
	case 'undoneitem':
		if(!ev.ctrlKey){
			return lr.itemClick(lr,lr_item,tgt);
		}
	case 'undone':
		all=false;
		lr_item.fadeOut(400);
		store.setTiddlerTag(item,false,lr.doneTag);
		store.setTiddlerTag(item,true,lr.itemTag);
		lr.renderItem(app,lr_st[0],t,false);
		break;
	case "donebtn":
		show=!show;
		if(show)$('.lr_done',app).empty();
		s=show?lr.lblShowDone:lr.lblHideDone;
		btn.attr({'show':show,'title':lr.lblClick+s}).html(s);
		onlyBin=true;
		dirty=false;
		break;
	case "delete":
		if(btn.hasClass('lr_altdel')||!ev.ctrlKey){
			if(lr.askDelete1&&!confirm(lr.msgDelete1.format([item]))){
				lr_item.attr('tmpMode','');
				return false;
			}
			story.closeTiddler(item,true);
			store.removeTiddler(item);
		} else lr.keep(lr,t,lst);
		lr_item.fadeOut(400,function(){$(this).remove();});
		return false;
		break;
	case "deleteall":
		tr=store.getTaggedTiddlers(lr.doneTag);
		tr.map(function(t){
			if(t.fields['lr_list']==lst)x.push(t.title);
		});
		if(x[0]){
			if(lr.askDeleteAll&&!confirm(lr.msgDeleteAll.format([x.length,x.join(', ')])))return false;
			x.map(function(t){
				story.closeTiddler(t,true);
				store.removeTiddler(t);
			});
			$('lr_done',app).empty();
		}else alert(lr.msgNoneDone);
		return false;
	case "order":
		if(ev.keyCode!=13)return true;
		num=parseInt(btn.val());
		if(isNaN(num)){alert(lr.errNum);return false;}
		lr.setOrder(lr,lst,item,num);
		break;
	case "edit":
		break;
	case "refresh": //must be last
		all=true;
	default: dirty=false;
	}

	if(all){
		if(!onlyBin)lr.render(lr.itemTag,app);
		if(!show&&!lock)lr.render(lr.doneTag,app);
		lr.addStyle(app);
	}

	if(!lock&&inp)inp.setAttribute('title',lr.lblTimeStamp.format([dt]));
	if(dirty)store.setDirty(true);
	return false;
},

render:function(tag,app,order)
{
	var b,el,h,hfix,item,inner,num=0,tgs='',
		lock=app.attr('lock')=='true',
		lr=config.macros.listr,
		d=lock?null:tag==lr.doneTag,
		list=$(d?'.lr_done':'.lr_items',app),
		tid=app.attr('one'),
		orph=app.attr('orph')=='true',
		ls=tid!=''?[store.getTiddler(tid)]:store.getTaggedTiddlers(tag),
		lst=app.attr('lr_list'),
		o=order?order:lr.getOrder(lr,lst),
		h=app.height();

	if(h>200)app.css('height',h);//prevents jumping
	list.empty().html('&nbsp;');

	//wikify('<<listr tiddler:%NEW%>>',list[0]);

	ls.map(function(t){
		if(t.fields['lr_list']==lst||tid!=''||(orph&&t.title!=lst)){
			num++;
			lr.renderItem(app,list[0],t,d,num);
		}
	});
	app.css('height',null);
},

renderItem:function(app,where,t,d,num) //if dis null then LOCKED, num may not be null
{
	var lr=config.macros.listr,
		edit=app.attr('edit')=='true',
		lst=app.attr('lr_list'),
		lock=d==null,
		h=app.attr('height'),
		hfix=h.indexOf('!')==0;
		h=hfix?h.substr(1):h;

	if(!hasClass(where,'lr_item')||!num&&num!=null){
		where=createTiddlyElement(where,'div',null,'lr_item');
		$(where).click(lr.update).attr(
			{
				title:lock?'':(lr[d?'lblUnDoneItem':'lblDoneItem']+(lr.openClick?lr.lblOpen:'')),
				item:t.title,
				mode:(d?'undoneitem':'doneitem'),
				height:h,
				num:num
			}
		);
	}
	else {
		$(where).empty().attr('item',t.title);
	}

	//UNLOCK ITEM
	if(!lock){
	$(createTiddlyElement(
		where,'div',null,'lr_tick lr_check button',d?'X':'\u00A0')
	).click(lr.update).attr({
		title:(lr[d?'lblUndone':'lblDone']),
		item:t.title,
		mode:(d?'undone':'done')
	}).bind('mouseover mousemove',function(e){
		var e=e?e:window.event;
		if(e.ctrlKey){
			if(!hasClass(this,'lr_altdel'))addClass(this,'lr_altdel');
		}
		else removeClass(this,'lr_altdel');
	}
	).mouseout(function(){removeClass(this,'lr_altdel');});;
	
	$(where
		).mouseover(function(){$('.lr_tick',this).html(d?'\u00A0':'X');}
		).mouseout(function(){$('.lr_tick',this).html(d?'X':'\u00A0');});

	el=$(createTiddlyElement(
		where,d?'div':'input',null,'lr_check button','X')
	)
	el.addClass(d?'lr_delete':'lr_order');
	if (d) {
		el.click(lr.update);
		el.html('X');
	}else {
		el.val(num);
		if (window.event) el.keydown(lr.update);
		else el.keypress(lr.update);
		el.focus(function(){
			this.select();
		});
	}
	el.attr({
		title:lr[d?'lblDelete1':'lblOrder'],
		item:t.title,
		mode:(d?'delete':'order')
	});

	el=$(createTiddlyElement(where,'div',null,'lr_ok button',lr.lblOk))
	el.click(lr.saveItem);
	el.attr({
		title:lr.btnOk,
		where:t.title,
	});
	}
	//END UNLOCK ITEM

	inner=createTiddlyElement(where,'div',null,'lr_inner'+(lock?' lr_lock':''));

	//UNLOCK INLINE EDIT
	if(!d&&(edit||!lock))$(inner).click(lr.editItem);

	lr.newEditor(inner,'title',lr.fmtTitle.format([t.title]),t,'input',d);
	tgs=lr.formatTags(lr,lst,t,lr.fmtTag);
	lr.newEditor(inner,'tags',tgs?tgs:lr.lblNoTags,t,'input',d);
	lr.newEditor(inner,'text',t.text,t,'textarea',d);
	wikify('{{lr_clr{}}}',inner);

	$('.lr_text',where).css({'overflow':'hidden','max-height':h});
	if(!hfix){
		$(where
		).mouseover(function(){$('.lr_text',this).css({'overflow':'auto','max-height':''});}
		).mouseout(function(){$('.lr_text',this).css({'overflow':'hidden','max-height':h});});
	}

	$('.lr_editable',where).attr('title',lock?'':lr.lblEdit.format([lr[d?'lblUnDoneItem':'lblDoneItem']]));
},

getOrder:function(lr,lst)
{
	var l=lr.getList(lr,lst),
		o=l.fields['lr_order'];

	//analyse string, return array

	return o;
},

itemClick:function(lr,item,tgt){
	var ex=['INPUT','TEXTAREA','A'],
		t=$('.lr_text',item),
		s=t.css('overflow')=='hidden'?{'overflow':'auto','max-height':''}:{'overflow':'hidden','max-height':item.attr('height')};
	if (tgt.getAttribute('href')||tgt.onclick&&!hasClass(tgt,'lr_inner')||ex.contains(n))return true;
	if(lr.openClick)story.displayTiddler(null,item.attr('item'));
	else t.css(s);
	return false;
},

setOrder:function(lr,lst,item,num,pos)
{
	var its,ls0,ls1=[];
	o=lr.getOrder(lr.lst);
	its=store.getTaggedTiddlers(lr.itemTag);
	its.map(function(t){
		if(t.fields['lr_list']==lst){
			ls1.push(t.title);
		}
	});
},

getList:function(lr,lst,tag)
{
	var l=store.getTiddler(lst);
	if(!l)l=store.saveTiddler(
		lst,
		lst,
		lr.newListText,
		config.options.txtUserName,
		new Date(),
		lr.itemTag,
		merge({lr_order:''},config.defaultCustomFields)
	);
	return l;
},

formatTags:function(lr,lst,tid,fmt)
{
	var t,
		f=fmt?fmt.split('%0'):null,
		bracket=function(t){
			return t.indexOf(' ')>0?'[['+t+']]':t;
		};
	if(tid.tags.length==0)return '';
	t=fmt?(f[0]+tid.tags.join(tid.tags.length?f[1]+f[0]:'')+f[1]):store.getValue(tid.title,'tags');
	t=t.replace(fmt?lr.fmtTag.format([lr.itemTag]):bracket(lr.itemTag),'');
	if(lr.tagToList&&!lr.showTagInList)
		t=t.replace(fmt?lr.fmtTag.format([lst]):bracket(lst),'');
	return t.trim();
},

newEditor:function(where,what,txt,tid,how,del)
{
	var lr=config.macros.listr,
		app=$(where).closest('.lr_list'),
		f=app.attr('focus');
		el=createTiddlyElement(where,'div',null,'lr_'+what+(del?'':' lr_editable'));
	if(txt!='')wikify(txt,el);
	else $(el).hide();
	if(!del){
		el=$(createTiddlyElement(where,how,null,'lr_'+what+' lr_edit')
		).attr({
			item:tid.title,
			edit:what,
			title:lr['lblEdit'+what.toUpperCase()]+lr.lblEditOut
		});
		if(f=='true'||f.indexOf(what)>=0)
			el.focus(function(){this.select();});
		window.event?el.keydown(lr.saveItem):el.keypress(lr.saveItem);
	}
},

editItem:function(ev)
{
	var n,
		ev=ev?ev:window.event,
		lr=config.macros.listr,
		el=$(this),
		item=el.closest('.lr_item'),
		app=item.closest('.lr_list'),
		lst=app.attr('lr_list'),
		ex=['INPUT','TEXTAREA','A'];
	if(ev.ctrlKey)return true;
	tgt=resolveTarget(ev);
	n=tgt.nodeName;
	n=n?n.toUpperCase():'';
	if (tgt.getAttribute('href')||tgt.onclick&&!hasClass(tgt,'lr_inner')||ex.contains(n))return true;
	$(this).attr('title',lr.lblEditOk.format([lr.lblOk]));
	$('.lr_editable',this).each(function(){
		var out,
			e=$(this),
			f=e.next(),
			t=store.getTiddler(f.attr('item')),
			edit=f.attr('edit');
		e.hide();
		f.css('display','block');
		if(edit=='tags')out=lr.formatTags(lr,lst,t);
		else out=t[edit];
		f.val(out);
		if(edit=='text')f[0].rows=out.split('\n').length;
		if(edit=='title')f.focus();
	});
	$('.lr_ok',item).show();
	$('.lr_order',item).hide();
	return false;
},

saveItem:function(ev)
{
	var abort,p,ti,txt,tags,
		ev=ev?ev:window.event,
		lr=config.macros.listr,
		item=$(this).closest('.lr_item'),
		app=item.closest('.lr_list'),
		lock=app.attr('lock')=='lock',
		d=app.attr('lock')=='true'?null:false,
		num=lock?0:$('.lr_order',item).val(),
		ti0=item[0].getAttribute('item'),
		tid=store.getTiddler(ti0),
		txt=$(this).attr('edit')=='text',
		dt=app.attr('ts')=='true'?lr.stamp(lr):null;

	//on ECAPE rerender item
	if(ev.keyCode==27){
		lr.renderItem(app,item[0],tid,d,item.attr('num'));
		return;
	}

	//on SHIFT-TAB in editor
	if(txt&&ev.keyCode==9&&ev.shiftKey){
		$('input.lr_tags',item).focus();
		lr.noBubble(ev);
	}

	//Abort if input field and npt ENTER (title or tags) or text (CTRL+ENTER)
	if(!this.innerHTML&&(ev.keyCode!=13||txt&&!ev.ctrlKey))return;

	//prevent editor
	lr.noBubble(ev);

	$('.lr_edit',item).each(function(){
		var el=$(this),
			v=el.val();
			what=el.attr('edit');
		if(what=='title'){
			ti=v;
			//alert(tid+' = old <> new = '+ti);
			if((ti0!=ti)&&store.getTiddler(ti)){
				p=prompt(lr.msgExists,lr.msgOpenTid);
				p=p?p.trim().toUpperCase():null;
				switch (p) {
					case 'OK':
						break;
					case lr.msgOpenTid.trim().toUpperCase():
						story.displayTiddler(null,ti);
					default:
						el.focus();
						abort=true;
				}
			}
		}
		else if(what=='tags')tags=v;
		else txt=v;
	});
	if(abort)return;

	//Abort if no title or take timestamp
	if(!ti&&dt)ti=dt;
	if(!ti){
		alert(lr.errTitle);
		$('input.lr_title',item).focus();
		return;
	}

	store.saveTiddler(
		ti0,
		ti,
		txt,
		config.options.txtUserName,
		new Date(),
		((app.attr('tagtolist')=='true'?'[['+app.attr('tiddler')+']]':'')+'[['+lr.itemTag+']] '+tags).readBracketedList(),
		tid.fields
	);
	lr.renderItem(app,item[0],tid,d,num);
	return false;
},

noBubble:function(e){
	e.cancelBubble=true;
	try{event.keyCode=0;}catch(e){};
	if (window.event) e.returnValue=false;
	if (e.preventDefault) e.preventDefault();
	if (e.stopPropagation) e.stopPropagation();
	return false;
},

addStyle:function(el){
	var b=false;
	$('.lr_item',el).each(function(){
		b=!b;
		addClass(this,b?'lr_item1':'lr_item2');
	});
},

keep:function(lr,tid,lst){
	var ti=tid.title,
		ref=lr.refTag.format([lst]);
	if(ref)store.setTiddlerTag(ti,true,ref);
	store.setTiddlerTag(ti,false,lr.itemTag);
	store.setTiddlerTag(ti,false,lr.doneTag);
	delete tid.fields['lr_list'];
},

error:function(lr,msg,el){
	wikify(lr.errListr.format([msg]),el);
},

gotoTitle:function(t,el){
	var tid,
		add=$(el).closest('.lr_add'),
		lst=add.closest('.lr_list').attr('lr_list'),
		lr=config.macros.listr;
	tid=store.getTiddler(t);
	if(lr.askAdd&&(tid.fields['lr_list']==lst||!confirm(lr.msgAdd.format([t])))){
		el.value='';
		add.attr('update','');
		return false;
	}else el.value=t;
	el.focus();
	add.attr('update','true');
	$('.addtext',add).val(tid.text);
	$('.addtags',add).val(lr.formatTags(lr,lst,tid));
},

stamp:function(lr){
	return (new Date()).formatString(lr.fmtTimeStamp);
}
}

var gt=config.macros.gotoTiddler;
if(gt){
gt.processItem=function(title,here,list,showlist) {
	if (!title.length) return;
	list.style.display=showlist?'block':'none';
	if (title=="*"){story.search(here.value);return false;}
	if (!showlist) here.value=title;
	var n=here.getAttribute('notify');
	if(n)eval(n+'("'+title+'",here)'); //notify of selection, otherwise...
	else story.displayTiddler(null,title); // show selected tiddler (default behaviour)
	return false;
}
gt.IEtableFixup="%0";
}

var ccd=config.commands.deleteTiddler;
if(!ccd.handlerLISTR)ccd.handlerLISTR=ccd.handler;

ccd.handler = function(event,src,title)
{
	var chk,p,tids=[],
		co=config.options,
		lr=config.macros.listr,
		its=store.getTaggedTiddlers(lr.itemTag);
	its.map(function(t){
		var f=t.fields['lr_list']
		if(f==title||!f&&title==lr.itemTag){
			tids.push(t);
		}
	});
	if(tids[0]){
		p=prompt(lr.msgDeleteList.format([tids.length]),lr.msgDeleteTid);
		p=p?p.trim().toUpperCase():null;
		switch (p) {
			case null:return;
			case 'OK':
			case 'REF':
				tids.map(function(t){
					if(p=='OK'){
						story.closeTiddler(t.title,true);
						store.removeTiddler(t.title);
					}else lr.keep(lr,t,t.title);
				});
		}
	}
	chk=co.chkConfirmDelete;
	if(p)co.chkConfirmDelete=false;
	ccd.handlerLISTR.apply(this,arguments);
	co.chkConfirmDelete=chk;
}

config.shadowTiddlers.StyleSheetListr = '/*{{{*/'+
	'.lr_list {width:100%;}\n'+
	'.lr_items,.lr_done, .lr_head, .lr_foot,.lr_head .sliderPanel'+
	'{display:block;padding:0;float:left;width:100%;}\n'+
	'.lr_items,.lr_done {margin-top:-10px;}\n'+

	'.lr_head .sliderPanel {display:none;padding:3px 0 0 0;}\n'+
	'.lr_check, .lr_btn, .lr_head .button {cursor:pointer;text-align:center;}\n'+
	'.lr_head .lr_btn, .lr_head .button, .lr_foot .lr_btn{display:block;float:left;margin:3px !important;padding:3px 10px !important;}\n'+
	'.lr_head .lr_refresh {float:right;position:relative;}\n'+
	'.lr_head .lr_submit {display:block;width:100%;margin:-1px 0 0 !important;padding:3px 0 !important;text-align:center;}\n'+

	'.lr_add {display:block;}\n'+
	'.lr_add div {float:left;}\n'+
	'.lr_add label {display:block;margin-top:3px;}\n'+
	'.lr_add input {display:block;width:100%;padding:2px;}\n'+
	'.lr_add textarea {display:block;width:100%;}\n'+

	'.lr_item {width:99%;padding:3px 0.5%;border:1px solid #ddd;margin-bottom:2px;z-index:0;cursor:pointer;}\n'+
	'.lr_item:hover {background:#ddf;border-width:1px 5px;margin-left:-4px}}\n'+
	'.lr_item1 {background:#f6f6f6;}\n'+
	'.lr_tick {float:left;font-size:1.2em;line-height:1em;font-weight:bold;'+
	'margin:2px 10px 0 2px !important;padding:0 !important;'+
	'width:1em;color:'+store.getTiddlerText('ColorPalette::SecondaryMid')+'}\n'+
	'.lr_tick:hover {color:'+store.getTiddlerText('ColorPalette::SecondaryDark')+'}\n'+
	'.lr_inner {margin:0 50px 0 28px;}'+
	'.lr_lock {margin:0;border:0;}'+
	'.lr_title {min-width:48%;padding:0 3px;float:left;}\n'+
	'.lr_tags {min-width:48%;padding:0 3px;float:right;text-align:right;}\n'+
	'input.lr_tags {text-align:left;}\n'+
	'.lr_order,.lr_delete,.lr_ok {display:block;float:right;width:30px;z-index:1;padding:3px !important;}\n'+
	'.lr_delete {width:15px;color:#F66;font-weight:bold;}\n'+
	'.lr_delete:hover, .lr_altdel:hover {color:#F66;}\n'+
	'.lr_text {float:left;padding:0 0.5%;width:99%;padding:3px 0 0 3px;width:99.5%;}\n'+
	'textarea.lr_text {min-height:100px;width:99%;}\n'+
	'.lr_edit {display:none}\n'+
	'.lr_ok {display:none;text-align:center;}\n'+
	'.lr_clr {display:block;clear:both;height:1px;width:100%;}\n'+
	 '/*}}}*/';
store.addNotification("StyleSheetListr", refreshStyles);

})(jQuery);
//}}}

/***
/%
!TEMPLATES
!!HEADER
{{lr_head{{{lr_refresh lr_btn button{refresh}}}%1}}}
!!DONE
{{lr_foot{{{lr_donebtn lr_btn button{}}}{{lr_deleteall lr_btn button{delete all done items}}} }}}{{lr_done{}}}
!!NEWLIST
<<newTiddler label:"new list" label:"Create a new listr" title:"New list"  text:{{store.getTiddlerText('ListrPlugin##MACRO')}} tag:"%0" focus:"title" fields:"lr_order:'' ">>
!!MACRO
<<listr>>
!!ADDFORM
<html>
<form class="lr_add" action="javascript:;">
<div style='width:30%;'><label>Title:</label><input class="lr_input addtitle" type="text" name="addtitle" title="item title" mode="add"></div>
<div style='width:46%;padding:0 2%;'><label>Tags:</label/><input class="lr_input addtags" type="text" name="addtags" title="item tags" mode="add"></div>
<div style='width:20%;'><label>&nbsp;</label/><div class="lr_submit lr_btn button">add item</div></div>
<div style='width:100%;'><label>Text:</label/><textarea  class="lr_input addtext" name="addtext" class="lr_input" title="item text" mode="add" rows=5></textarea></div>
</form>
</html>
!END
%/
***/