/***
|''Navn:''|danish|
|''Beskrivelse:''|Translation of TiddlyWiki into Danish|
|''Forfatter:''|Måns Mårtensson (humamamm (at) gmail (dot) com)|
|''Kilde:''|danish.tiddlyspace.com |
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/association/locales/core/en/locale.en.js |
|''Version:''|0.3.7|
|''Dato:''|Jul 6, 2007|
|''Kommentarer:''|Kontakt venligst oversætteren i tilfælde af korrektioner |
|''Licens:''|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]] |
|''~CoreVersion:''|2.4|
***/

//{{{
//--
//-- Translateable strings
//--

// Strings in "double quotes" should be translated; strings in 'single quotes' should be left alone

config.locale = "da"; // W3C language tag

if (config.options.txtUserName == 'YourName') // do not translate this line, but do translate the next line
	merge(config.options,{txtUserName: "DitNavn"});

merge(config.tasks,{
	save: {text: "gem", tooltip: "Gem dine ændringer til denne TiddlyWiki", action: saveChanges},
	sync: {text: "synk", tooltip: "Synkronisér ændringer med andre TiddlyWiki filer og servere", content: '<<sync>>'},
	importTask: {text: "importér", tooltip: "Importér tiddlers og plugins fra andre TiddlyWiki filer og servere", content: '<<importTiddlers>>'},
	tweak: {text: "Tilpas", tooltip: "Tilpas TiddlyWikis udseende og opførsel", content: '<<options>>'},
	upgrade: {text: "upgradér", tooltip: "Upgrader TiddlyWikis kerne kode", content: '<<upgrade>>'},
	plugins: {text: "udvidelser", tooltip: "Administrér installerede udvidelser", content: '<<plugins>>'}
});

// Options that can be set in the options panel and/or cookies
merge(config.optionsDesc,{
	txtUserName: "Brugernavn til signering af dine ændringer",
	chkRegExpSearch: "Avend almindelige udtryk til søgninger",
	chkCaseSensitiveSearch: "Forskel på store og små bogstaver",
	chkIncrementalSearch: "Bogstav for bogstav-søgning",
	chkAnimate: "Anvend animationer",
	chkSaveBackups: "Gem en backupfil når der gemmes ændringer",
	chkAutoSave: "Gem automatisk ændringer",
	chkGenerateAnRssFeed: "Lav et RSS feed når der gemmes ændringer",
	chkSaveEmptyTemplate: "Lav en tom skabelon når der gemmes ændringer",
	chkOpenInNewWindow: "Åben internet links i et nyt vindue",
	chkToggleLinks: "Når man klikker på et link i åbne tiddlers lukkes de",
	chkHttpReadOnly: "Skjul redigeringsværktøjer når den vises over HTTP",
	chkForceMinorUpdate: "Opdatér ikke brugernavn og dato når tiddlers bliver ændrede",
	chkConfirmDelete: "Bed om bekræftelse før tiddlers slettes",
	chkInsertTabs: "Brug tab tasten til at indsætte tab tegn istedet for at hoppe imellem felter",
	txtBackupFolder: "Navn på mappe til brug for backups",
	txtMaxEditRows: "Maximum antal af rækker i edit bokse",
	txtFileSystemCharSet: "Default tegnsæt til at gemme ændringer (Kun i Firefox/Mozilla)"});

merge(config.messages,{
	customConfigError: "Der opstod problemer ved loading af udvidelser. Se PluginManager for detaljer",
	pluginError: "Fejl: %0",
	pluginDisabled: "Ikke udført fordi det er slået fra via 'systemConfigDisable' tag",
	pluginForced: "Udført fordi det er tvunget via 'systemConfigForce' tag",
	pluginVersionError: "Ikke udført fordi denne udvidelse kræver en nyere udgave af TiddlyWiki",
	nothingSelected: "Intet er valgt. Du er nødt til at vælge en eller flere ting først",
	savedSnapshotError: "Det ser ud som om denne TiddlyWiki er blevet gemt forkert. Se venligst http://www.tiddlywiki.com/#DownloadSoftware for details",
	subtitleUnknown: "(ukendt)",
	undefinedTiddlerToolTip: "Tiddleren '%0' findes ikke endnu",
	shadowedTiddlerToolTip: "Tiddleren '%0' findes ikke endnu, men har en foruddefineret skygge værdi",
	tiddlerLinkTooltip: "%0 - %1, %2",
	externalLinkTooltip: "Internet link til %0",
	noTags: "Der er ingen taggede tiddlere",
	notFileUrlError: "Du er nødt til at gemme denne TiddlyWiki til en fil før du kan gemme ændringer",
	cantSaveError: "Det er ikke muligt at gemme ændringer. Mulige grunde indbefatter:\n- din browser understøtter det ikke (Firefox, Internet Explorer, Safari og Opera virker alle fint hvis de er konfigurerede korrekt)\n- stien til din TiddlyWiki fil indeholder ulovlige tegn\n- TiddlyWiki HTML filen er blevet flyttet eller omdøbt",
	invalidFileError: "Den originale fil '%0' lader ikke til at være en rigtig TiddlyWiki",
	backupSaved: "Backup gemt",
	backupFailed: "Det lykkedes IKKE at gemme en backup fil",
	rssSaved: "RSS feed gemt",
	rssFailed: "Det lykkedes IKKE at gemme et RSS feed",
	emptySaved: "Tom skabelon gemt",
	emptyFailed: "Det lykkedes IKKE at gemme en tom skabelon",
	mainSaved: "Hoved TiddlyWiki fil gemt",
	mainFailed: "Det lykkedes IKKE at gemme hoved TiddlyWiki filen. Dine ændringer er IKKE blevet gemt",
	macroError: "Fejl i makro <<\%0>>",
	macroErrorDetails: "Fejl ved udførsel af makro <<\%0>>:\n%1",
	missingMacro: "Ingen sådan makro",
	overwriteWarning: "En tiddler med navnet '%0' findes allerede. Vælg OK for at overskrive den",
	unsavedChangesWarning: "ADVARSEL! Der er ugemte ændringer i TiddlyWikien\n\nVælg OK for at gemme\nVælg FORTRYD for at afvise",
	confirmExit: "--------------------------------\n\nDer er ugemte ændringer i TiddlyWikien. Hvis du fortsætter vil du miste disse ændringer\n\n--------------------------------",
	saveInstructions: "GemÆndringer",
	unsupportedTWFormat: "Ikke understøttet TiddlyWiki format '%0'",
	tiddlerSaveError: "Fejl ved forsøg på at gemme tiddler '%0'",
	tiddlerLoadError: "Fejl ved load af tiddler '%0'",
	wrongSaveFormat: "Kan ikke gemme med formatet '%0'. Bruger standard format til at gemme.",
	invalidFieldName: "Ikke tilladt feltnavn %0",
	fieldCannotBeChanged: "Felt '%0' kan ikke ændres",
	loadingMissingTiddler: "Forsøger at hente tiddleren '%0' fra '%1' serveren ved:\n\n'%2' i arbejdsområdet '%3'",
	upgradeDone: "Opgradering til version %0 er nu fuldført\n\nKlik 'OK' for at genopfriske den nyligt opgraderede TiddlyWiki"});

merge(config.messages.messageClose,{
	text: "luk",
	tooltip: "luk dette meddelelsesområde"});

config.messages.backstage = {
	open: {text: "-", tooltip: "Åben bagsceneområdet for at ændre på nogle grundlæggende indstillinger"},
	close: {text: "luk", tooltip: "Luk bagsceneområdet"},
	prompt: "-",
	decal: {
		edit: {text: "edit", tooltip: "Redigér tiddleren '%0'"}
	}
};

config.messages.listView = {
	tiddlerTooltip: "Klik for at se hele denne tiddlers tekst",
	previewUnavailable: "(forhåndsvisning er ikke tilgængelig)"
};

config.messages.dates.months = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November","December"];
config.messages.dates.days = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
config.messages.dates.shortMonths = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
config.messages.dates.shortDays = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"];
// suffixes for dates, eg "1ste","2den","3die"..."30te","31te"
config.messages.dates.daySuffixes = ["ste","den","die","te","te","te","te","te","te","te",
		"te","te","te","te","te","te","te","te","te","te",
		"ste","den","die","te","te","te","te","te","te","te",
		"te"];
config.messages.dates.am = "formiddag";
config.messages.dates.pm = "eftermiddag";

merge(config.messages.tiddlerPopup,{
	});

merge(config.views.wikified.tag,{
	labelNoTags: "ingen tags",
	labelTags: "tags: ",
	openTag: "Åben tag '%0'",
	tooltip: "Vis tiddlere der er taggede med '%0'",
	openAllText: "Åben alle",
	openAllTooltip: "Åben alle disse tiddlere",
	popupNone: "Ingen andre tiddlere er taggede med '%0'"});

merge(config.views.wikified,{
	defaultText: "Tiddleren '%0' findes ikke endnu. Dobbelt-klik for at lave den",
	defaultModifier: "(mangler)",
	shadowModifier: "(indbygget skygge tiddler)",
	dateFormat: "DD MMM YYYY", // use this to change the date format for your locale, eg "YYYY MMM DD", do not translate the Y, M or D
	createdPrompt: "lavet"});

merge(config.views.editor,{
	tagPrompt: "Skriv tags delt med mellemrum, [[brug 2 dobbelte firkantede klammer]] om nødvendigt, eller tilføj allerede eksisterende",
	defaultText: "Skriv teksten til '%0'"});

merge(config.views.editor.tagChooser,{
	text: "tags",
	tooltip: "Vælg eksisterende tags som tilføjelse til denne tiddler",
	popupNone: "Der er ikke defineret nogen tags",
	tagTooltip: "Tilføj tagget '%0'"});

merge(config.messages,{
	sizeTemplates:
		[
		{unit: 1024*1024*1024, template: "%0\u00a0GB"},
		{unit: 1024*1024, template: "%0\u00a0MB"},
		{unit: 1024, template: "%0\u00a0KB"},
		{unit: 1, template: "%0\u00a0B"}
		]});

merge(config.macros.search,{
	label: "søg",
	prompt: "Søg i denne TiddlyWiki",
	accessKey: "F",
	successMsg: "Der er fundet %0 tiddlere som matcher %1",
	failureMsg: "Der er ikke fundet nogen tiddlere som matcher %0"});

merge(config.macros.tagging,{
	label: "tagger: ",
	labelNotTag: "tagger ikke",
	tooltip: "Liste over tiddlere der er taggede med '%0'"});

merge(config.macros.timeline,{
	dateFormat: "DD MMM YYYY"});// use this to change the date format for your locale, eg "YYYY MMM DD", do not translate the Y, M or D

merge(config.macros.allTags,{
	tooltip: "Vis tiddlere der er taggede med '%0'",
	noTags: "Der er ingen taggede tiddlere"});

config.macros.list.all.prompt = "Alle tiddlere i alfabetisk orden";
config.macros.list.missing.prompt = "Tiddlere der linkes til men som ikke er definerede";
config.macros.list.orphans.prompt = "Tiddlere som der ikke linkes til fra nogen andre tiddlere";
config.macros.list.shadowed.prompt = "Tiddlere som er skyggede med grundlæggende indhold";
config.macros.list.touched.prompt = "Tiddlere som er blevet ændret lokalt ";

merge(config.macros.closeAll,{
	label: "luk alle",
	prompt: "Luk alle viste tiddlere (undtaget dem som er ved at blive redigerede)"});

merge(config.macros.permaview,{
	label: "vis permalink",
	prompt: "Lav et link til en URL som henter alle de netop nu synlige tiddlere"});

merge(config.macros.saveChanges,{
	label: "gem ændringer",
	prompt: "Gem alle tiddlere for at lave en ny TiddlyWiki",
	accessKey: "S"});

merge(config.macros.newTiddler,{
	label: "ny tiddler",
	prompt: "Lav en ny tiddler",
	title: "Ny Tiddler",
	accessKey: "N"});

merge(config.macros.newJournal,{
	label: "ny journal",
	prompt: "Lav en ny tiddler ud fra nuværende dato og tid",
	accessKey: "J"});

merge(config.macros.options,{
	wizardTitle: "Tilpas avancerede muligheder",
	step1Title: "Disse muligheder gemmes i cookies i din browser",
	step1Html: "<input type='hidden' name='markList'></input><br><input type='checkbox' checked='false' name='chkUnknown'>Vis ukendte muligheder</input>",
	unknownDescription: "//(ukendt)//",
	listViewTemplate: {
		columns: [
			{name: 'Option', field: 'option', title: "Option", type: 'String'},
			{name: 'Description', field: 'description', title: "Description", type: 'WikiText'},
			{name: 'Name', field: 'name', title: "Name", type: 'String'}
			],
		rowClasses: [
			{className: 'lowlight', field: 'lowlight'}
			]}
	});

merge(config.macros.plugins,{
	wizardTitle: "Administrer udvidelser",
	step1Title: "Aktive udvidelser",
	step1Html: "<input type='hidden' name='markList'></input>", // DO NOT TRANSLATE
	skippedText: "(Denne udvidelse er ikke blevet aktiveret fordi den først er blevet tilføjet efter start)",
	noPluginText: "Der er ikke installeret nogen udvidelser",
	confirmDeleteText: "Er du sikker på at du vil slette disse udvidelser:\n\n%0",
	removeLabel: "Fjern systemConfig tag",
	removePrompt: "Fjern systemConfig tag",
	deleteLabel: "slet",
	deletePrompt: "Slet disse tiddlere permanent",
	listViewTemplate: {
		columns: [
			{name: 'Selected', field: 'Selected', rowName: 'title', type: 'Selector'},
			{name: 'Tiddler', field: 'tiddler', title: "Tiddler", type: 'Tiddler'},
			{name: 'Size', field: 'size', tiddlerLink: 'size', title: "Size", type: 'Size'},
			{name: 'Forced', field: 'forced', title: "Forced", tag: 'systemConfigForce', type: 'TagCheckbox'},
			{name: 'Disabled', field: 'disabled', title: "Disabled", tag: 'systemConfigDisable', type: 'TagCheckbox'},
			{name: 'Executed', field: 'executed', title: "Loaded", type: 'Boolean', trueText: "Yes", falseText: "No"},
			{name: 'Startup Time', field: 'startupTime', title: "Startup Time", type: 'String'},
			{name: 'Error', field: 'error', title: "Status", type: 'Boolean', trueText: "Error", falseText: "OK"},
			{name: 'Log', field: 'log', title: "Log", type: 'StringList'}
			],
		rowClasses: [
			{className: 'error', field: 'error'},
			{className: 'warning', field: 'warning'}
			]}
	});

merge(config.macros.toolbar,{
	moreLabel: "mere",
	morePrompt: "Vis flere muligheder"
	});

merge(config.macros.refreshDisplay,{
	label: "genopfrisk",
	prompt: "Genopfrisk TiddlyWikiens udseende"
	});

merge(config.macros.importTiddlers,{
	readOnlyWarning: "Du kan ikke importere til en låst TiddlyWiki fil. Prøv at åbne den fra en fil:// URL",
	wizardTitle: "Importer tiddlere fra en anden fil eller server",
	step1Title: "Trin 1: Find serveren eller TiddlyWiki filen",
	step1Html: "Vælg servertypen: <select name='selTypes'><option value=''>Choose...</option></select><br>Indskriv webadresse eller sti her: <input type='text' size=50 name='txtPath'><br>...eller søg efter en fil: <input type='file' size=50 name='txtBrowse'><br><hr>...eller vælg et forudbestemt feed: <select name='selFeeds'><option value=''>Vælg...</option></select>",
	openLabel: "åbn",
	openPrompt: "Åbn forbindelsen til denne fil eller server",
	openError: "Der var problemer med at hente tiddlywiki filen",
	statusOpenHost: "Forbinder til hosten",
	statusGetWorkspaceList: "Henter en liste over tilgængelige arbejdsområder",
	step2Title: "Trin 2: Vælg arbejdsområde",
	step2Html: "Indskriv et navn på arbejdsområdet: <input type='text' size=50 name='txtWorkspace'><br>...eller vælg et der allerede er der: <select name='selWorkspace'><option value=''>Choose...</option></select>",
	cancelLabel: "fortryd",
	cancelPrompt: "Fortryd denne import",
	statusOpenWorkspace: "Åben arbejdsområdet",
	statusGetTiddlerList: "Henter listen over tilgængelige tiddlere",
	errorGettingTiddlerList: "Fejl ved hentning af liste over tiddlere, klik Fortryd for at prøve igen",
	step3Title: "Trin 3: Vælg hvilke tiddlere der skal importeres",
	step3Html: "<input type='hidden' name='markList'></input><br><input type='checkbox' checked='true' name='chkSync'>Hold disse tiddlere linket til denne server så du kan synkronisere efterfølgende ændringer</input><br><input type='checkbox' name='chkSave'>Gem detaljerne for denne server i en 'systemServer' tiddler kaldet:</input> <input type='text' size=25 name='txtSaveTiddler'>",
	importLabel: "importer",
	importPrompt: "Importer disse tiddlere",
	confirmOverwriteText: "Er du sikker på at du vil overskrive disse tiddlere:\n\n%0",
	step4Title: "Trin 4: Importerer %0 tiddler(e)",
	step4Html: "<input type='hidden' name='markReport'></input>", // DO NOT TRANSLATE
	doneLabel: "udført",
	donePrompt: "Luk denne wizard",
	statusDoingImport: "Importerer tiddlere",
	statusDoneImport: "Alle tiddlere er importede",
	systemServerNamePattern: "%2 on %1",
	systemServerNamePatternNoWorkspace: "%1",
	confirmOverwriteSaveTiddler: "Tiddleren '%0' findes allerede. Klik 'OK' for at overskrive den med detaljerne fra denne server, eller 'Fortryd' for at efterlade uændret",
	serverSaveTemplate: "|''Type:''|%0|\n|''URL:''|%1|\n|''Workspace:''|%2|\n\nDenne tiddler blev lavet automatisk for at skrive denne servers detaljer",
	serverSaveModifier: "(System)",
	listViewTemplate: {
		columns: [
			{name: 'Selected', field: 'Selected', rowName: 'title', type: 'Selector'},
			{name: 'Tiddler', field: 'tiddler', title: "Tiddler", type: 'Tiddler'},
			{name: 'Size', field: 'size', tiddlerLink: 'size', title: "Size", type: 'Size'},
			{name: 'Tags', field: 'tags', title: "Tags", type: 'Tags'}
			],
		rowClasses: [
			]}
	});

merge(config.macros.upgrade,{
	wizardTitle: "Opgrader TiddlyWikis kerne kode",
	step1Title: "Opdater eller reparer denne TiddlyWiki til sidste nye udgivelse",
	step1Html: "Du er ved at opgradere til sidste nye udgave af TiddlyWikis kerne kode (from <a href='%0' class='externalLink' target='_blank'>%1</a>). Dit indhold vil blive bibeholdt under opgraderinen.<br><br>Bemærk at opgraderinger kan konfikte med gamle udvidelser. Hvis du får problemer med den opgraderede fil se her <a href='http://www.tiddlywiki.org/wiki/CoreUpgrades' class='externalLink' target='_blank'>http://www.tiddlywiki.org/wiki/CoreUpgrades</a>",
	errorCantUpgrade: "Kan ikke opgradere denne TiddlyWiki. Du kan kun opgradere en TiddlyWiki fil som er gemt lokalt på en pc",
	errorNotSaved: "Du skal gemme ændringer før du kan gennemføre en opgradering",
	step2Title: "Bekræft opgraderingsdetaljer",
	step2Html_downgrade: "Du er ved at nedgradere til TiddlyWiki version %0 fra %1.<br><br>Nedgradering til en ældre udgave af kerne koden er IKKE tilrådeligt",
	step2Html_restore: "Denne tiddlyWike bruger allerede den sidste nye kerne kode (%0).<br><br>Du kan fortsætte med opgraderingen for at sikre dig at koden ikke er blevet ødelagt",
	step2Html_upgrade: "Du er ved at opgradere til TiddlyWiki version %0 fra %1",
	upgradeLabel: "opgrader",
	upgradePrompt: "Forbered opgraderingsprocessen",
	statusPreparingBackup: "Forbereder backup",
	statusSavingBackup: "Gemmer backup fil",
	errorSavingBackup: "Der var problemer med at gemme backup filen",
	statusLoadingCore: "Loader kernekoden",
	errorLoadingCore: "Fejl ved load af kernekoden",
	errorCoreFormat: "Fejl ved den nye kernekode",
	statusSavingCore: "Gemmer den nye kernekode",
	statusReloadingCore: "Genloader den nye kernekode",
	startLabel: "start",
	startPrompt: "Start opgraderingsprocessen",
	cancelLabel: "fortryd",
	cancelPrompt: "Fortryd opgraderingsprocessen",
	step3Title: "Opgradering afbrudt",
	step3Html: "Du har afbrudt opgraderingsprocessen"
	});

merge(config.macros.sync,{
	listViewTemplate: {
		columns: [
			{name: 'Selected', field: 'selected', rowName: 'title', type: 'Selector'},
			{name: 'Tiddler', field: 'tiddler', title: "Tiddler", type: 'Tiddler'},
			{name: 'Server Type', field: 'serverType', title: "Server type", type: 'String'},
			{name: 'Server Host', field: 'serverHost', title: "Server host", type: 'String'},
			{name: 'Server Workspace', field: 'serverWorkspace', title: "Server workspace", type: 'String'},
			{name: 'Status', field: 'status', title: "Synchronisation status", type: 'String'},
			{name: 'Server URL', field: 'serverUrl', title: "Server URL", text: "View", type: 'Link'}
			],
		rowClasses: [
			],
		buttons: [
			{caption: "Synkronisér disse tiddlere", name: 'sync'}
			]},
	wizardTitle: "Synkroniser med internet servere og filer",
	step1Title: "Vælg hvilke tiddlere du vil synkronisere",
	step1Html: "<input type='hidden' name='markList'></input>", // DO NOT TRANSLATE
	syncLabel: "synk",
	syncPrompt: "Synkronisér disse tiddlere",
	hasChanged: "Ændret imens den var koblet fra",
	hasNotChanged: "Uændret imens den var koblet fra",
	syncStatusList: {
		none: {text: "...", color: "gennemsigtig", display:null},
		changedServer: {text: "Ændret på serveren", color: '#8080ff', display:null},
		changedLocally: {text: "Ændret imens den var koblet fra", color: '#80ff80', display:null},
		changedBoth: {text: "ændret imens den var koblet fra også på serveren", color: '#ff8080', display:null},
		notFound: {text: "Ikke fundet på serveren", color: '#ffff80', display:null},
		putToServer: {text: "Gemt update på serveren", color: '#ff80ff', display:null},
		gotFromServer: {text: "Hentet update fra serveren", color: '#80ffff', display:null}
		}
	});

merge(config.commands.closeTiddler,{
	text: "luk",
	tooltip: "Luk denne tiddler"});

merge(config.commands.closeOthers,{
	text: "luk andre",
	tooltip: "Luk alle andre tiddlere"});

merge(config.commands.editTiddler,{
	text: "redigér",
	tooltip: "Redigér denne tiddler",
	readOnlyText: "se",
	readOnlyTooltip: "Se denne tiddlers kilde"});

merge(config.commands.saveTiddler,{
	text: "færdig",
	tooltip: "Gem ændringer til denne tiddler"});

merge(config.commands.cancelTiddler,{
	text: "fortryd",
	tooltip: "Fortryd ændringer til denne tiddler",
	warning: "Er du sikker på at du vil fortryde dine ændringer til  '%0'?",
	readOnlyText: "færdig",
	readOnlyTooltip: "Se tiddlere normalt"});

merge(config.commands.deleteTiddler,{
	text: "slet",
	tooltip: "Slet denne tiddler",
	warning: "Er du sikker på at du vil slette '%0'?"});

merge(config.commands.permalink,{
	text: "permalink",
	tooltip: "Permalink til denne tiddler"});

merge(config.commands.references,{
	text: "referencer",
	tooltip: "Vis tiddlere som linker til denne tiddler",
	popupNone: "Ingen referencer"});

merge(config.commands.jump,{
	text: "spring",
	tooltip: "Spring til en anden tiddler"});

merge(config.commands.syncing,{
	text: "synkroniserer",
	tooltip: "Kontroller synkronisering af denne tiddler med en server eller en fil",
	currentlySyncing: "<div>Currently syncing via <span class='popupHighlight'>'%0'</span> to:</"+"div><div>host: <span class='popupHighlight'>%1</span></"+"div><div>workspace: <span class='popupHighlight'>%2</span></"+"div>", // Note escaping of closing <div> tag
	notCurrentlySyncing: "Sykroniserer ikke lige nu",
	captionUnSync: "Stop synkronisering af denne tiddler",
	chooseServer: "Synkronisér denne tiddler med en anden server:",
	currServerMarker: "\u25cf ",
	notCurrServerMarker: "  "});

merge(config.commands.fields,{
	text: "felter",
	tooltip: "Vis denne tiddlers udvidede felter",
	emptyText: "Der er ingen udvidede felter til rådighed for denne tiddler",
	listViewTemplate: {
		columns: [
			{name: 'Field', field: 'field', title: "Field", type: 'String'},
			{name: 'Value', field: 'value', title: "Value", type: 'String'}
			],
		rowClasses: [
			],
		buttons: [
			]}});

merge(config.shadowTiddlers,{
	DefaultTiddlers: "[[Kom i gang]]",
	MainMenu: "[[Kom i gang]]\n\n\n^^~TiddlyWiki version <<version>>\nÂ© 2007 [[UnaMesa|http://www.unamesa.org/]]^^",
	"Kom i gang": "For at komme i gang med denne tomme tiddlywiki, skal du ændre på de følgende tiddlere:\n* SiteTitle & SiteSubtitle: Sidens titel og undertitel, som vist øverst (efter de er gemt, vil de også vise sig i browserens titelmenu)\n* MainMenu: er hovedmenuen (oftest placeret til venstre)\n* DefaultTiddlers: Indeholder navnene på de tiddlere du vil have skal starte op når du åbner TiddlyWiki\nDu skal også skrive dit brugernavn for at signere dine redigeringer: <<option txtUserName>>\nHvis du ikke bryder dig om farvesammensætningen, klik da på \n<<RandomColorPaletteButton>> for at generere et nyt tilfældigt farve skema.",
	SiteTitle: "Min TiddlyWiki",
	SiteSubtitle: "en genbrugelig ikke-liniær personlig web notesbog",
	SiteUrl: "http://www.tiddlywiki.com/",
	OptionsPanel: "Disse muligheder for at ændre på TiddlyWiki bliver gemt i din browser\n\nDit brugernavn til at signere dine ændringer. Skriv det som et WikiOrd (f.eks. PerPoulsen)\n<<option txtUserName>>\n\n<<option chkSaveBackups>> Gem backups\n<<option chkAutoSave>> Gem automatisk\n<<option chkRegExpSearch>> Regexp search\n<<option chkCaseSensitiveSearch>> Søg på store og små bogstaver\n<<option chkAnimate>> Tillad animationer\n\n----\nSe også [[AvanceredeMuligheder|AdvancedOptions]]",
	SideBarOptions: '<<search>><<closeAll>><<permaview>><<newTiddler>><<newJournal "DD MMM YYYY" "journal">><<saveChanges>><<slider chkSliderOptionsPanel OptionsPanel "muligheder \u00bb" "Skift TiddlyWikis avancerede muligheder">>',
	SideBarTabs: '<<tabs txtMainTab "Tidslinie" "Tidslinie" TabTimeline "Alle" "Alle tiddlere" TabAll "Tags" "Alle tags" TabTags "Flere" "Flere lister" TabMore>>',
	TabMore: '<<tabs txtMoreTab "Mangler" "Manglende tiddlere" TabMoreMissing "Uden tilknytning" "Tiddlere" TabMoreOrphans "Skygger" "Skyggede tiddlere" TabMoreShadowed>>'
	});

merge(config.annotations,{
	AdvancedOptions: "Denne skygge tiddler giver adgang til flere avancerede muligheder",
	ColorPalette: "Disse værdier i denne skyggetiddler bestemmer hvilket farveskema, der bliver brugt til ~TiddlyWikis brugerflade",
	DefaultTiddlers: "Tiddlere som er listede i denne skyggetiddler vil automatisk blive vist når ~TiddlyWiki starter op",
	EditTemplate: "HTML skabelonen i denne skyggetiddler bestemmer hvordan tiddlere ser ud når de bliver redigerede",
	GettingStarted: "Denne skyggetiddler giver instruktioner om grundlæggende anvendelse",
	ImportTiddlers: "Denne skyggetiddler giver mulighed for at importere tiddlere",
	MainMenu: "Denne tiddler bliver brugt til at definere indholdet af hoved menuen i venstre side af skærmen",
	MarkupPreHead: "Denne tiddler bliver indsat i toppen af <head> sektionen på TiddlyWiki HTML filen",
	MarkupPostHead: "Denne tiddler bliver indsat i bunden af <head> sektionen på TiddlyWiki HTML filen",
	MarkupPreBody: "Denne tiddler bliver indsat i toppen af<body> sektionen på TiddlyWiki HTML filen",
	MarkupPostBody: "Denne tiddler bliver indsat i slutningen af  <body> sektionen på TiddlyWiki HTML filen umiddelbart efter script blokken",
	OptionsPanel: "Denne skyggetiddler bliver brugt til indholdet af muligheder skydepanelet i højre side",
	PageTemplate: "HTML skabelonen i denne skyggetiddler bestemmer det overordnede ~TiddlyWiki layout",
	PluginManager: "Denne skyggetiddler giver adgang til udvidelsesadministrationen",
	SideBarOptions: "Denne skyggetiddler bruges til indholdet af muligheder panelet i højre sidemenu",
	SideBarTabs: "Denne skyggetiddler bruges til indholdet af fanebladspanelet i højre sidemenu",
	SiteSubtitle: "Denne skyggetiddler bruges som anden del af sidens titel",
	SiteTitle: "Denne skyggetiddler bruges som første del af sidens titel",
	SiteUrl: "Denne skyggetiddler bør sættes til den fulde mål-URL til publikation",
	StyleSheetColors: "Denne skyggetiddler indeholder CSS definitionerne der bestemmer farverne på side elementerne. ''REDIGÉR IKKE DENNE TIDDLER'', lav i stedet dine ændringer i StyleSheet skyggetiddleren",
	StyleSheet: "Denne tiddler kan indeholde specielle CSS definitioner",
	StyleSheetLayout: "Denne skyggetiddler indeholder CSS definitioner der bestemmer layoutet på side elementer. ''REDIGÉR IKKE DENNE TIDDLER'', lav i stedet dine ændringer i StyleSheet skyggetiddleren",
	StyleSheetLocale: "Denne skyggetiddler indeholder CSS definitioner relateret til lokale oversættelser",
	StyleSheetPrint: "Denne skyggetiddler indeholder CSS definitioner til print",
	TabAll: "Denne skyggetiddler indeholder hvad der er i 'Alle' fanen i højre sidemenu",
	TabMore: "Denne skyggetiddler indeholder  hvad der er i 'Flere' fanen i højre sidemenu",
	TabMoreMissing: "Denne skyggetiddler indeholder  hvad der er i 'Mangler' fanen i højre sidemenu",
	TabMoreOrphans: "Denne skyggetiddler indeholder  hvad der er i  'Mangler tilknytning' fanen i højre sidemenu",
	TabMoreShadowed: "Denne skyggetiddler indeholder  hvad der er i 'Skyggede' fanen i højre sidemenu",
	TabTags: "Denne skyggetiddler indeholder  hvad der er i 'Tags' fanen i højre sidemenu",
	TabTimeline: "Denne skyggetiddler indeholder hvad der er i 'Tidslinie' fanen i højre sidemenu",
	ToolbarCommands: "Denne skyggetiddler bestemmer hvilke værktøjer der vises i tiddleres værktøjslinier",
	ViewTemplate: "HTML skabelonen i denne skyggetiddler bestemmer hvordan tiddlere ser ud"
	});

//}}}