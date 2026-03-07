/***
|''Name:''|FE2|
|''Description:''|create, edit, view and delete commands in toolbar <<toolbar fields>>|
|''Version:''|1.0.3|
|''Date:''|2011.07.18|
|''Source:''|http://tbGTD.tiddlyspot.com|
|''Author:''|Tobias Beer|
|''License:''|[[BSD open source license|License]]|
|''~CoreVersion:''|2.5.3|
|''Browser:''|Firefox 2.0; InternetExplorer 6.0, others|
!Note
This is a refactored version of [[FieldsEditorPlugin|http://visualtw.ouvaton.org/VisualTW.html#FieldsEditorPlugin]] by Pascal Collin
!Installation:
*import this tiddler, keep tagged as systemConfig, save and reload
!Inline use
<<FE2 tidName inline btnText btnTooltip>>
*tidName is required and 'inline' triggers inline mode
*btnText and btn Tooltip are optional
!Code
***/
//{{{
(function($){
//language settings for header, also see language options for macro.FE2 below!
config.commands.fields.lang={field:"field",actions:"actions",value:"value"};
config.commands.fields.handlePopup=function(popup,title){
	addClass(popup,'FE2');
	var tid=store.fetchTiddler(title);
	if(!tid)return;
	var t='[['+title+']]';
	var fields={};
	store.forEachField(tid,function(tid,field,v){fields[field]=v;},true);
	var list=[];
	for(var f in fields){
		var e='[['+f+']]';
		list.push({
			field:f,
			value:fields[f],
			actions:"<<FE2 "+t+" rename "+e+">> <<FE2 "+t+" delete "+e+">> <<FE2 "+t+" edit "+e+">>"
		});
	}
	list.sort(function(a,b){return a.field<b.field?-1:(a.field==b.field?0:+1);});
	list.push({field:'',value:"",actions:"<<FE2 "+t+" create>>"});
	var table=ListView.create(popup,list,{
		columns:[
			{name:'Field',field:'field',title:this.lang.field,type:'String'},
			{name: 'Actions',field:'actions',title:this.lang.actions,type: 'WikiText'},
			{name:'Value',field:'value',title:this.lang.value,type:'WikiText'}
		],
		rowClasses:[
				{field:'actions'}
		],
		buttons:[	//can't use button for selected then delete, because click on checkbox will hide the popup
		]
	});
}
config.macros.FE2={
	//language options
	lang:{
		'delete':'delete', //string since keyword!
		rename:'<rename',
		create:'Create a new field...',
		edit:'edit>',
		inline:'fields',
		lineBreaks:"The field value contains linebreaks.\nEditing here will convert it to a single line!\nProceed?",
		enterName:"Enter new field name...",
		enterNewName:"Enter new name for '%1'...",
		enterVal:"Enter field value for '%1'...", 
		enterNewVal:"Enter new value for '%1'..",
		doDelete:"Delete field '%1' from tiddler '%2' ?",
		existing:"This field already exists! ",
		btnInline:'edit fields',
		btnInlineTooltip:'Click to edit the fields of tiddler "%0"...'
	},
	handler:function(place,macroName,params,wikifier,paramString,tiddler){
		if(!readOnly){
			var tid=params[0];
			var mode=params[1];
			var field=params[2];
			if(mode='inline'){
				var txt = field?field:this.lang['btnInline'];
				var tip = (params[3]?params[3]:this.lang['btnInlineTooltip']).format([tid]);
				var btn = createTiddlyButton(null,txt,tip,config.macros.toolbar.onClickPopup);
				btn.setAttribute('commandName','fields');
				btn.setAttribute('tiddler',tid);
				addClass(btn,'command_fields');
				place.appendChild(btn);
			}else{
				var btn=createTiddlyButton(place,this.lang[mode],this.lang[mode]+" "+field,this.clicked);
				btn.setAttribute("tiddler",tid);
				btn.setAttribute("field",field);
				btn.setAttribute("mode",mode);
			}
		}
	},
	clicked:function(){
		var lng=config.macros.FE2.lang;
		var title=this.getAttribute("tiddler");
		var field=this.getAttribute("field");
		var mode=this.getAttribute("mode");
		var tid=store.getTiddler(title);
		if(!tid)return;
		switch(mode){
			case'create':
				var first="";
				do{
					field=prompt(first+ lng.enterName,"");
					first=lng.existing;
				}while(store.getValue(tid,field));
				if(field){
					var v=prompt(lng.enterVal.replace(/%1/,field),"");
					if(v)tid.fields[field]=v;else return;
				}else return;
				break;
			case'delete':
				if(confirm(lng.doDelete.replace(/%1/,field).replace(/%2/,title))){
					delete tid.fields[field];
				}else return;
				break;
			case'edit':
				var v=tid.fields[field]||'';
				if(!v.match(/\n/mg)||confirm(lng.lineBreaks)){
					var v=prompt(lng.enterNewVal.replace(/%1/,field),v);
					if(v||v=='')tid.fields[field]=v;else return;
				}else return;
				break;
			case'rename':
				var name=prompt(lng.enterNewName.replace(/%1/,field),field);
				if(name){
					tid.fields[name]=tid.fields[field];
					delete tid.fields[field];
				}else return;
				break;
			default:return;
		}
		store.saveTiddler(tid.title,tid.title,tid.text,tid.modifier,tid.modified,tid.tags,tid.fields);
		story.refreshTiddler(title,null,true);
		return false;
	}
}

config.shadowTiddlers.StyleSheetFE2=
	".FE2 td br{display:block;}\n"+
	".FE2 td {font-size:12px;padding:1px 3px}\n"+
	".FE2 .button {border:0;padding:0 0.2em;color:#999;}\n"+
	".FE2 .button:hover {background:transparent;color:#BBB;}\n"+
	".FE2 .twtable,.FE2 .twtable thead, .FE2 .twtable tr{border:0}\n"+
	".FE2 .twtable tr:hover{background:"+store.getTiddlerSlice('ColorPalette','TertiaryDark')+"}\n"+
	".FE2 .twtable thead{font-size:13px;}";
store.addNotification("StyleSheetFE2",refreshStyles);
})(jQuery);
//}}}