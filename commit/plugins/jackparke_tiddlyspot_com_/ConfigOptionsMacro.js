/***
|''Name:''|ConfigOptionsMacro|
|''Version:''|0.1 (31 May 2007)|
|''Source''|http://jackparke.googlepages.com/jtw.html#ConfigOptionsMacro ([[del.icio.us|http://del.icio.us/post?url=http://jackparke.googlepages.com/jtw.html%23ConfigOptionsMacro]])|
|''Author:''|[[Jack]]|
!Description
This plugin allows you to store TiddlyWiki options in a tiddler. This means the options are part of the store and are not shared among TiddlyWiki files. The options are also more robust and persist when cookies are loaded.
!Usage
*After installation, enter the options you want persisted into the [[ConfigOptions]] tiddler
*In view mode of this tiddler you can see and modify the options
*Changes are effective and written immediately to the ConfigOptions tiddler as you modify them
*The options are loaded from ConfigOptions on startup of TiddlyWiki overriding any cookie settings
!Revision History
* Original by [[Jack]] 31 May 2007

!Code
***/
//{{{
version.extensions.configOptions = {major: 0, minor: 0, revision: 1, date: new Date('May 31, 2007')};

config.shadowTiddlers.ConfigOptions = '<<configOptions\nchkAutoSave=false\ntxtUserName=Your Name\n>>'

config.macros.configOptions = {};
config.macros.configOptions.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
 var resultText = this.parseOptions(paramString);
 if (resultText) {
  resultText = '|!Option|!Value|\n' + resultText;
  wikify(resultText, place)
  //createTiddlyButton(place,'Update','Saves your current options to the ConfigOptions tiddler.',this.update);
  applyHtmlMacros(place,tiddler)
 }
}

config.macros.configOptions.init = function() {
 var txtConfigOptions = store.getValue('ConfigOptions', 'text') || config.shadowTiddlers.ConfigOptions; 
 txtConfigOptions = txtConfigOptions.substr(txtConfigOptions.indexOf('\n')).substr(0, txtConfigOptions.length-2);
 this.parseOptions(txtConfigOptions);
}
config.macros.configOptions.parseOptions = function (paramString) {
 var resultText = ''
 var options = paramString.split(/\n/);
 for(var i=0; i < options.length; i++) {
  var opt = options[i].split('=');
  if(opt.length > 1) {
   if (opt[1] != 'true' && opt[1] != 'false' && !opt[1].match(/^\d+$/))
    opt[1] = '\'' + opt[1].replace(/'/, '\\\'') + '\'';
    resultText += '|' + opt[0].replace(/^[a-z]{2,3}/,'') + '|<<option ' + opt[0] + '>>|\n'
   try {
    eval('config.options.' + opt[0] + ' = ' + opt[1] + ';');
    //alert('config.options.' + opt[0] + ' = ' + opt[1] + ';')
   } catch (e) {
    debugger
   }
  }
 }
 return resultText;
}
config.macros.option.propagateOption = function(opt,valueField,value,elementType)
{
	config.options[opt] = value;
//	saveOptionCookie(opt);
	//if (opt=='txtUserName') debugger;
	if ((new RegExp('\n' + opt + '=','g')).test(store.getValue('ConfigOptions','text'))) {
	 config.macros.configOptions.updateOption(opt, decodeCookie(config.optionHandlers[opt.substr(0,3)].get(opt)))
	}
	
	var nodes = document.getElementsByTagName(elementType);
	for(var t=0; t<nodes.length; t++) {
		var optNode = nodes[t].getAttribute("option");
		if(opt == optNode)
			nodes[t][valueField] = value;
		}

}
config.macros.configOptions.updateOption = function(name, value) {
 var txtConfigOptions = store.getValue('ConfigOptions', 'text'); 
 var t1 = txtConfigOptions.indexOf('\n' + name + '=');
 var t2 = txtConfigOptions.indexOf('\n', t1+1);
 txtConfigOptions = txtConfigOptions.substr(0,t1) + '\n' + name + '=' + value + txtConfigOptions.substr(t2)
 store.setValue('ConfigOptions', 'text', txtConfigOptions)
}
//}}}