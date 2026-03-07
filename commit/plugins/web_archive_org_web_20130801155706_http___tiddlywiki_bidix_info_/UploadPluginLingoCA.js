/***
|''Name:''|UploadPluginLingoCA|
|''Description:''|Catalan Translation|
|''Version:''|4.1.0|
|''Date:''|July 15, 2007|
|''Source:''|http://pacoriviere.googlepages.com/UploadPluginLingoCA.js|
|''Author:''|PacoRivière (web (at) pacoriviere (dot) cat)|
|''License:''|[[BSD open source license|http://tiddlywiki.bidix.info/#%5B%5BBSD%20open%20source%20license%5D%5D ]]|
|''CoreVersion:''|2.2.0|
|''Requires:''|UploadPlugin UploadToHomeMacro|
***/
//{{{
config.macros.upload.label = {
	promptOption: "Desa aquest TiddlyWiki i puja'l amb UploadOptions",
	promptParamMacro: "Desa aquest TiddlyWiki i puja'l a %0",
	saveLabel: "desa a la web", 
	saveToDisk: "desa al disc",
	uploadLabel: "puja" 
};

config.macros.upload.messages = {
	noStoreUrl: "No s'ha desat la URL als paràmetres o opcions",
	usernameOrPasswordMissing: "Falta el nom d'usuari o contrassenya"
};

merge(config.macros.uploadOptions, {
	wizardTitle: "Puja amb opcions",
	step1Title: "Aquestes opcions es desen en galetes del vostre navegador",
	step1Html: "<input type='hidden' name='markList'></input><br>",
	cancelButton: "Anul·la",
	cancelButtonPrompt: "Avís d'anul·lació",
	listViewTemplate: {
		columns: [
			{name: 'Description', field: 'description', title: "Descripció", type: 'WikiText'},
			{name: 'Option', field: 'option', title: "Opció", type: 'String'},
			{name: 'Name', field: 'name', title: "Nom", type: 'String'}
			],
		rowClasses: [
			{className: 'lowlight', field: 'lowlight'} 
			]}
	});


bidix.upload.messages = {
	//from saving
	invalidFileError: "Sembla que l'arxiu original '%0' no és un TiddlyWiki vàlid",
	backupSaved: "S'ha desat la còpia de seguretat a la web",
	backupFailed: "No ha estat possible desar la còpia de seguretat a la web",
	rssSaved: "S'ha pujat el canal RSS",
	rssFailed: "No ha estat possible pujar l'arxiu del canal RSS",
	emptySaved: "S'ha pujat la plantilla buida",
	emptyFailed: "No ha estat possible pujar l'arxiu de plantilla buit",
	mainSaved: "S'ha pujat l'arxiu principal de TiddlyWiki",
	mainFailed: "No ha estat possible pujar l'arxiu principal de TiddlyWiki. No s'han desat els vostres canvis",
	//specific upload
	loadOriginalHttpPostError: "No es pot obtenir l'arxiu original",
	aboutToSaveOnHttpPost: 'Quant a pujar a %0 ...',
	storePhpNotFound: "No s'ha trobat la seqüència per pujar '%0'."
};

merge(config.optionsDesc,{
	txtUploadStoreUrl: "Url de la seqüència del servei de pujada, UploadService (per omissió: store.php)",
	txtUploadFilename: "Nom de l'arxiu a pujar (per omissió: a index.html)",
	txtUploadDir: "Carpeta Relativa per desar l'arxiu (per omissió: . (downloadService directory))",
	txtUploadBackupDir: "Carpeta Relativa per desar la còpia de seguretat. Si és buit no es fa la còpia. (per omissió: ''(buit))",
	txtUploadUserName: "Nom d'usuari per pujar",
	pasUploadPassword: "Contrassenya per pujar",
	chkUploadLog: "Porta un registre a UploadLog (per omissió: cert)",
	txtUploadLogMaxLine: "Nombre màxim de línies del registre de pujada, UploadLog (per omissió: 10)"
});

merge(config.tasks,{
	uploadOptions: {text: "puja", tooltip: "Canvia les UploadOptions i puja", content: '<<uploadOptions>>'}
});

//}}}

//{{{
/*
 * UploadToHomeMacro Lingo
 */
if (config.macros.uploadToHome) {
	merge(config.macros.uploadToHome,{messages: {
			homeParamsTiddler: "HomeParameters",
			prompt: "Desa aquest TiddlyWiki i puja'l amb els paràmeters del tiddler  '%0'",
			tiddlerNotFound: "No s'ha trobat el Tiddler %0"
		}});
	merge(config.tasks,{
				uploadToHome: {text: "uploadToHome", tooltip: "Puja amb '" + config.macros.uploadToHome.messages.homeParamsTiddler + "' tiddler",
				action: config.macros.uploadToHome.action}
		});
}

//}}}