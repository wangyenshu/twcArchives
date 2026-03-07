/***
|Name|LoadTiddlersPlugin|
|Source|http://www.TiddlyTools.com/#LoadTiddlersPlugin|
|Documentation|http://www.TiddlyTools.com/#LoadTiddlersPluginInfo|
|Version|3.7.5|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|plugin|
|Requires||
|Overrides||
|Options|##Configuration|
|Description|macro for automated updates or one-click installations of tiddlers from remote sources|
!!!!!Documentation
>see [[LoadTiddlersPluginInfo]]
!!!!!Configuration
<<<
__password-protected server settings //(optional, if needed)//:__
>username: <<option txtRemoteUsername>> password: <<option txtRemotePassword>>
>{{{usage: <<option txtRemoteUsername>> <<option txtRemotePassword>>}}}
>''note: these settings are also used by [[ExternalTiddlersPlugin]] and [[ImportTiddlersPlugin]]''
<<<
!!!!!Revisions
<<<
2009.08.30 [3.7.5] in doImport(), check status and report error, if any
|please see [[LoadTiddlersPluginInfo]] for additional revision details|
2005.07.20 [1.0.0] Initial Release
<<<
!!!!!Code
***/
//{{{
version.extensions.LoadTiddlersPlugin= {major: 3, minor: 7, revision: 5, date: new Date(2009,8,30)};

config.macros.loadTiddlers = {
	label: '',
	tip: "add/update tiddlers from '%0'",
	lockedTag: 'noReload',	// if existing tiddler has this tag value, don't overwrite it, even if inbound tiddler is newer
	askMsg: 'Please enter a local path/filename or a remote URL',
	openMsg: 'Opening %0',
	openErrMsg: 'Could not open %0 - error=%1',
	readMsg: 'Read %0 bytes from %1',
	foundMsg: 'Found %0 tiddlers in %1',
	nochangeMsg: "'%0' is up-to-date... skipped.",
	lockedMsg: "'%0' is tagged '%1'... skipped.",
	skippedMsg: 'skipped (cancelled by user)',
	loadedMsg: 'Loaded %0 of %1 tiddlers from %2',
	reportTitle: 'ImportedTiddlers',
	warning: "Warning!!  Processing '%0' as a systemConfig (plugin) tiddler may produce unexpected results! Are you sure you want to proceed?",
	handler: function(place,macroName,params) {
		var label=(params[0] && params[0].substr(0,6)=='label:')?params.shift().substr(6):this.label;
		var tip=(params[0] && params[0].substr(0,7)=='prompt:')?params.shift().substr(7):this.tip;
		var filter='updates';
		if (params[0] && (params[0]=='all' || params[0]=='new' || params[0]=='changes' || params[0]=='updates'
			|| params[0].substr(0,8)=='tiddler:' || params[0].substr(0,4)=='tag:'))
			filter=params.shift();
		var src=params.shift(); if (!src || !src.length) return; // filename is required
		var quiet=(params[0]=='quiet'); if (quiet) params.shift();
		var ask=(params[0]=='confirm'); if (ask) params.shift();
		var force=(params[0]=='force'); if (force) params.shift();
		var init=(params[0]=='init'); if (init) params.shift();
		var nodirty=(params[0]=='nodirty'); if (nodirty) params.shift();
		var norefresh=(params[0]=='norefresh'); if (norefresh) params.shift();
		var noreport=(params[0]=='noreport'); if (noreport) params.shift();
		var noreportshow=(params[0]=='noreportshow'); if (noreportshow) params.shift();

		this.newTags=[]; if (params[0]) this.newTags=params; // any remaining params are used as 'autotags'
		if (label.trim().length) {
			// link triggers load tiddlers from another file/URL and then applies filtering rules to add/replace tiddlers in the store
			createTiddlyButton(place,label.format([src.replace(/%20/g,' ')]),tip.format([src.replace(/%20/g,' ')]), function() {
				if (src=='ask') src=prompt(this.askMsg);
				config.macros.loadTiddlers.loadFile(src,config.macros.loadTiddlers.doImport,{quiet:quiet,ask:ask,filter:filter,force:force,init:init,noreport:noreport,noreportshow:noreportshow});
				return false;
			})
		}
		else {
			// load tiddlers from another file/URL and then apply filtering rules to add/replace tiddlers in the store
			if (src=='ask') src=prompt(this.askMsg);
			config.macros.loadTiddlers.loadFile(src,config.macros.loadTiddlers.doImport,{quiet:quiet,ask:ask,filter:filter,force:force,init:init,nodirty:nodirty,norefresh:norefresh,noreport:noreport,noreportshow:noreportshow});
		}
	},
	loadFile: function(src,callback,params) {
		var quiet=params.quiet;
		if (src==undefined || !src.length) return null; // filename is required
		if (!quiet) clearMessage();
		if (!quiet) displayMessage(this.openMsg.format([src.replace(/%20/g,' ')]));
		// if working locally and src is not a URL, read from local filesystem
		if (document.location.protocol=='file:' && src.substr(0,5)!='http:' && src.substr(0,5)!='file:') {
			var txt=loadFile(src);
			if (!txt) { // file didn't load, might be relative path.. try fixup
				var pathPrefix=document.location.href;  // get current document path and trim off filename
				var slashpos=pathPrefix.lastIndexOf('/'); if (slashpos==-1) slashpos=pathPrefix.lastIndexOf('\\'); 
				if (slashpos!=-1 && slashpos!=pathPrefix.length-1) pathPrefix=pathPrefix.substr(0,slashpos+1);
				src=pathPrefix+src;
				if (pathPrefix.substr(0,5)!='http:') src=getLocalPath(src);
				var txt=loadFile(src);
			}
			if (!txt) { // file still didn't load, report error
				if (!quiet) displayMessage(this.openErrMsg.format([src.replace(/%20/g,' '),'(unknown)']));
			} else {
				if (!quiet) displayMessage(this.readMsg.format([txt.length,src.replace(/%20/g,' ')]));
				if (version.major+version.minor*.1+version.revision*.01!=2.52)
					txt=convertUTF8ToUnicode(txt);
				if (callback) callback(true,params,txt,src,null);
			}
		} else { // use XMLHttpRequest
			doHttp('GET',src,null,null,config.options.txtRemoteUsername,config.options.txtRemotePassword,callback,params,null);
		}
	},
	readTiddlersFromHTML: function(html) {
		// for TW2.2+
		if (TiddlyWiki.prototype.importTiddlyWiki!=undefined) {
			var remoteStore=new TiddlyWiki();
			remoteStore.importTiddlyWiki(html);
			return remoteStore.getTiddlers('title');	
		}
	},
	readTiddlersFromCSV: function(CSV) {
		var remoteStore=new TiddlyWiki();
		var lines=CSV.split('\n'); var names=lines[0].split(','); CSV=lines.join('\n')
		// ENCODE commas and newlines within quoted values
		var comma='!~comma~!'; var commaRE=new RegExp(comma,'g');
		var newline='!~newline~!'; var newlineRE=new RegExp(newline,'g');
		CSV=CSV.replace(/\x22((?:[^\x22]|\x22\x22)*?)\x22/g,
			function(x){ return x.substr(1,x.length-2).replace(/\,/g,comma).replace(/\n/g,newline); });
		// PARSE lines
		var lines=CSV.split('\n');
		for (var i=1; i<lines.length; i++) { if (!lines[i].length) continue;
			var values=lines[i].split(',');
			// DECODE commas, newlines and doubled-quotes within quoted values
			for (var v=0; v<values.length; v++)
				values[v]=values[v].replace(commaRE,',').replace(newlineRE,'\n').replace(/\x22\x22/g,'\x22');
			// EXTRACT tiddler values
			var title=''; var text=''; var tags=[]; var fields={};
			var created=null; var when=new Date(); var who=config.options.txtUserName;
			for (var v=0; v<values.length; v++) { var val=values[v];
				if (names[v]) switch(names[v].toLowerCase()) {
					case 'title':	title=val.replace(/\[\]\|/g,'_'); break;
					case 'created': created=new Date(val); break;
					case 'modified':when=new Date(val); break;
					case 'modifier':who=val; break;
					case 'text':	text=val; break;
					case 'tags':	tags=val.readBracketedList(); break;
					default:	fields[names[v].toLowerCase()]=val; break;
				}
			}
			// CREATE tiddler in temporary store
			if (title.length) remoteStore.saveTiddler(title,title,text,who,when,tags,fields,true,created||when);
		}
		return remoteStore.getTiddlers('title');	
	},
	doImport: function(status,params,html,src,xhr) {
		var cml=config.macros.loadTiddlers; // abbrev
		src=src.split('?')[0]; // strip off "?nocache=..."
		if (!status) {
			displayMessage(cml.openErrMsg.format([src.replace(/%20/g,' '),xhr.status]));
			return false;
		}
		var quiet=params.quiet;
		var ask=params.ask;
		var filter=params.filter;
		var force=params.force;
		var init=params.init;
		var nodirty=params.nodirty;
		var norefresh=params.norefresh;
		var noreport=params.noreport;
		var noreportshow=params.noreportshow;
		var tiddlers = cml.readTiddlersFromHTML(html);
		if (!tiddlers||!tiddlers.length) tiddlers=cml.readTiddlersFromCSV(html);
		var count=tiddlers?tiddlers.length:0;
		if (!quiet) displayMessage(cml.foundMsg.format([count,src.replace(/%20/g,' ')]));
		var wasDirty=store.isDirty();
		store.suspendNotifications();
		var count=0;
		if (tiddlers) for (var t=0;t<tiddlers.length;t++) {
			var inbound = tiddlers[t];
			var theExisting = store.getTiddler(inbound.title);
			if (inbound.title==cml.reportTitle)
				continue; // skip 'ImportedTiddlers' history from the other document...
			if (theExisting && theExisting.tags.contains(cml.lockedTag)) {
				if (!quiet) displayMessage(cml.lockedMsg.format([theExisting.title,cml.lockedTag]));
				continue; // skip existing tiddler if tagged with 'noReload'
			}
			// apply the all/new/changes/updates filter (if any)
			if (filter && filter!='all') {
				if ((filter=='new') && theExisting) // skip existing tiddlers
					continue;
				if ((filter=='changes') && !theExisting) // skip new tiddlers
					continue;
				if ((filter.substr(0,4)=='tag:') && inbound.tags.indexOf(filter.substr(4))==-1) // must match specific tag value
					continue;
				if ((filter.substr(0,8)=='tiddler:') && inbound.title!=filter.substr(8)) // must match specific tiddler name
					continue;
				if (!force && store.tiddlerExists(inbound.title) && ((theExisting.modified.getTime()-inbound.modified.getTime())>=0)) {
					var msg=cml.nochangeMsg;
					if (!quiet&&msg.length) displayMessage(msg.format([inbound.title]));
					continue;
				}
			}
			// get confirmation if required
			if (ask && !confirm((theExisting?'Update':'Add')+" tiddler '"+inbound.title+"'\nfrom "+src.replace(/%20/g,' ')+'\n\nOK to proceed?'))
				{ tiddlers[t].status=cml.skippedMsg; continue; }
			// DO IT!
			var tags=new Array().concat(inbound.tags,cml.newTags);
	                store.saveTiddler(inbound.title, inbound.title, inbound.text, inbound.modifier, inbound.modified, tags, inbound.fields, true, inbound.created);
	                store.fetchTiddler(inbound.title).created = inbound.created; // force creation date to imported value - needed for TW2.1.3 or earlier
			tiddlers[t].status=theExisting?'updated':'added'
			if (init && tags.contains('systemConfig') && !tags.contains('systemConfigDisable')) {
				var ok=true;
				if (ask||!quiet) ok=confirm(cml.warning.format([inbound.title]))
				if (ok) { // run the plugin
					try { window.eval(inbound.text); tiddlers[t].status+=' (plugin initialized)'; }
					catch(ex) { displayMessage(config.messages.pluginError.format([exceptionText(ex)])); }
				}
			}
			count++;
		}
		store.resumeNotifications();
		if (count) {
			// optionally: set/clear 'unsaved changes' flag, refresh page display, and generate a report
			store.setDirty(wasDirty||!nodirty);
			if (!norefresh) {
				story.forEachTiddler(function(t,e){if(!story.isDirty(t))story.refreshTiddler(t,null,true)});
				store.notifyAll();
			}
			if (!noreport) cml.report(src,tiddlers,count,quiet,noreportshow);
		}
		// always show final message when tiddlers were actually loaded
		if (!quiet||count) displayMessage(cml.loadedMsg.format([count,tiddlers.length,src.replace(/%20/g,' ')]));
	},
	report: function(src,tiddlers,count,quiet,noreportshow) {
		// format the new report content
		var newText = 'On '+(new Date()).toLocaleString()+', ';
		newText += config.options.txtUserName+' loaded '+count+' tiddlers ';
		newText += 'from\n[['+src+'|'+src+']]:\n';
		newText += '<<<\n';
		for (var t=0; t<tiddlers.length; t++)
			if (tiddlers[t].status)
				newText += '#[['+tiddlers[t].title+']] - '+tiddlers[t].status+'\n';
		newText += '<<<\n';
		// get current report (if any)
		var title=config.macros.loadTiddlers.reportTitle;
		var currText='';
		var theReport = store.getTiddler(title);
		if (theReport) currText=((theReport.text!='')?'\n----\n':'')+theReport.text;
		// update the ImportedTiddlers content and show the tiddler
		store.saveTiddler(title, title, newText+currText, config.options.txtUserName, new Date(), theReport?theReport.tags:null, theReport?theReport.fields:null);
		if (!(quiet || noreportshow) ) { story.displayTiddler(null,title,1,null,null,false); story.refreshTiddler(title,1,true); }
	}
}
//}}}