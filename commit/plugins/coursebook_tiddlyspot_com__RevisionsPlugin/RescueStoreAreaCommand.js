/%
|Name|RescueStoreAreaCommand|
|Source|http://www.TiddlyTools.com/#RescueStoreAreaCommand|
|Version|1.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|script bookmarklet|
|Requires|InlineJavascriptPlugin|
|Overrides||
|Description|rescue tiddler changes from online document when net goes down during editing|
%/<script label="$1" title="rescue tiddlers from current document storeArea">
	if(typeof version==undefined||version.title!='TiddlyWiki')
		{alert(document.location.href+'\n\nis not a TiddlyWiki document');return false;}
	if (!confirm('Preparing to rescue storeArea contents... press OK to proceed')) return false;
	var sa=store.allTiddlersAsHtml().htmlEncode();
	var win=window.open();
	win.document.open();
	win.document['write']('<html><body><pre>'+sa+'</pre></body></html>');
	win.document.close();
	alert('copy/paste the displayed storeArea content into a local text file');
	win.focus();
</script><script>
	if ("$1"=="$"+"1") place.lastChild.innerHTML="Rescue current storeArea contents";
</script>