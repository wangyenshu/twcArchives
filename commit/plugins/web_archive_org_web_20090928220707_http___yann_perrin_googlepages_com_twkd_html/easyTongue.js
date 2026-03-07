/***
|!''Name:''|!easyTongue|
|''Description:''|The tongue command allows you to mark selection as being from the chosen language|
|''Version:''|0.1.0|
|''Date:''|13/01/2007|
|''Source:''|[[TWkd|http://yann.perrin.googlepages.com/twkd.html#easyTongue]]|
|''Author:''|[[Yann Perrin|YannPerrin]]|
|''License:''|[[BSD open source license]]|
|''~CoreVersion:''|2.x|
|''Browser:''|Firefox 1.0.4+; Firefox 1.5; InternetExplorer 6.0|
|''Requires:''|@@color:red;''E.A.S.E''@@|
***/
//{{{
config.commands.tongue = new TWkd.Ease(':P','mark selection as being in selected language');
if (version.extensions.PolyGlotPlugin) {
	for (var i=0; i<config.macros.polyglot.languages.length; i++)
		config.commands.tongue.addMode({
			name:config.macros.polyglot.languages[i],
			tooltip:'mark selection as being in '+config.macros.polyglot.languages[i]+' language',
			operation:function(){
				config.commands.tongue.putInPlace("{{"+this.name+"{"+TWkd.context.selection.content+"}}}",TWkd.context.selection);
			}
		});
	config.commands.tongue.addMode({
		name:config.macros.polyglot.hidewhenactive,
		tooltip:'selection should be hidden from view when PolyGlotPlugin is installed',
		operation:function(){
			config.commands.tongue.putInPlace("{{"+this.name+"{"+TWkd.context.selection.content+"}}}",TWkd.context.selection);
		}
	});
	}
else {
	config.commands.tongue.addMode({
		name:'Unfulfilled dependency',
		tooltip:'PolyGlotPlugin is needed',
		operation:function(){displayMessage('PolyGlotPlugin is needed to run this command','http://yann.perrin.googlepages.com/twkd.html#PolyGlotPlugin');}
});
}
//}}}

