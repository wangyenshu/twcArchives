/***
''Version 2.1.0 3/10/06 ''
!Traduction française des messages intégrés dans le TiddlyWiki de base de JeremyRuston, à jour avec la version 2.1.0
__NDT:__
^^Toute traduction peut-être discutée. Celle-ci a été faite en pensant à un utilisateur non spécialiste.
D'où les choix :
| //tiddler -> élément<<br>>tag, to tag -> index, indexer<<br>>plugin -> extension<<br>>empty file template -> fichier de base "empty.html"//<<br>>Mais :<<br>>//backup -> backup//<<br>>(traduire ce terme consacré introduirait des confusions) |
//Traduction// Jacques Turbé : http://avm.free.fr//TiddlyWiki-fr.html ^^

Avec la version 2.1.0 de TiddlyWiki apparaissent deux nouvelles fonctions intégrées :
''Importations'' et ''Extensions'' : Les boutons d'appel correspondants sont ajoutés au bas de votre OptionPanel par le code suivant : {{{[[Importations|ImportTiddlers]]}}} et {{{[[Extensions|PluginManager]]}}}

!!!Script de fusion des textes //''pour les versions antérieures à 2.0.11''//
***/
/*{{{*/
if(window.merge == undefined)
{
merge = function(dst,src)
{
 for (p in src)
 dst[p] = src[p];
 return dst;
}
}
/*}}}*/
/***
!!!Chaînes traduites
***/
/*{{{*/

// Messages
merge(config.messages,{
	customConfigError: "Problème rencontré pour charger des extensions. Activer le menu 'Extensions' pour les détails",
	pluginError: "Erreur: %0",
	pluginDisabled: "Extension désactivée en raison de l'index 'systemConfigDisable' tag",
	pluginForced: "Exécution forcée en raison de l'index 'systemConfigForce' tag",
	pluginVersionError: "Cette extension ne peut être exécutée car elle nécessite une version plus récente de TiddlyWiki",
	nothingSelected: "Pas de sélection faite. Il faut sélectionner au moins un item d'abord",
 savedSnapshotError: "Cet exemplaire de TiddlyWiki ne semble pas conforme. Reportez-vous à http://www.tiddlywiki.com/#DownloadSoftware",
 subtitleUnknown: "(inconnu)",
 undefinedTiddlerToolTip: "L'élément '%0' n'est pas encore créé",
 shadowedTiddlerToolTip: "L'élément '%0' n'est pas encore créé, mais a un contenu par défaut.",
 tiddlerLinkTooltip: "%0 - %1, %2",
 externalLinkTooltip: "%0",
 noTags: "Il n'y a pas d'éléments indexés",
 notFileUrlError: "Les données entrées sont mémorisées pendant cette session. Pour les conserver, il faudra faire une sauvegarde avant de quitter",
 cantSaveError: "Sauvegarde impossible : soit votre navigateur ne permet pas de sauvegarder les changements (préférez FireFox si possible), soit l'adresse de votre fichier contient des caractères invalides.",
 invalidFileError: "Le fichier '%0' choisi ne semble pas être un TiddlyWiki valide",
 backupSaved: "Sauvegarde effectuée",
 backupFailed: "Echec de l'enregistrement du backup",
 rssSaved: "Flux RSS sauvegardé",
 rssFailed: "Echec de l'enregistrement du flux RSS",
 emptySaved: "Fichier de base 'empty.html' enregistré",
 emptyFailed: "Echec de l'enregistrement du fichier neuf 'empty'",
 mainSaved: "Mise à jour du fichier TiddlyWiki enregistrée",
 mainFailed: "Echec de l'enregistrement du nouveau fichier TiddlyWiki. Vos modifications ne sont pas enregistrées",
 macroError: "Erreur dans la macro <<%0>>",
 macroErrorDetails: "Erreur d'exécution de la macro <<%0>>:\n%1",
 missingMacro: "Macro non trouvée",
 overwriteWarning: "Il y a déjà un élément nommé '%0'. Confirmez pour le remplacer",
 unsavedChangesWarning: "ATTENTION! Les dernières modifications de ce TiddlyWiki n'ont pas été enregistrées.\n\nOK pour les enregistrer\nANNULER pour les abandonner",
 confirmExit: "--------------------------------\n\nSi vous quittez maintenant vous perdrez les modifications qui n'ont pas été sauvegardées.\n\n--------------------------------",
 saveInstructions: "Sauvegarder"});

merge(config.messages.messageClose,{
 text: "fermer",
 tooltip: "ferme cette zône messages"});

config.messages.dates.months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre","décembre"];
config.messages.dates.days = ["dimanche", "lundi","mardi", "mercredi", "jeudi", "vendredi", "samedi"];

merge(config.views.wikified.tag,{
 labelNoTags: "non indexé",
 labelTags: "Index : ",
 openTag: "Ouvrir '%0'",
 tooltip: "Afficher les éléments indexés avec '%0'",
 openAllText: "Ouvrir tous",
 openAllTooltip: "Ouvrir tous les éléments de cet index",
 popupNone: "Pas d'autres éléments indexés avec '%0'"});

merge(config.views.wikified,{
 defaultText: "'%0' n'a pas encore été créé. Double-cliquez pour entrer un texte.",
 defaultModifier: "(absent)",
 shadowModifier: "(défaut)"});

merge(config.views.editor,{
 tagPrompt: "Séparez les index avec un espace (doubles crochets si besoin), ou sélectionnez un index existant",
 defaultText: "Entrez le texte de '%0'"});

merge(config.views.editor.tagChooser,{
 text: "index",
 tooltip: "Sélectionner les index existants à associer à cet élément",
 popupNone: "Pas d'index déjà définis",
 tagTooltip: "Associer à l'index '%0'"});

merge(config.macros.search,{
 label: "chercher",
 prompt: "Rechercher dans ce TiddlyWiki",
 accessKey: "F",
 successMsg: "%0 éléments correspondent à %1",
 failureMsg: "Aucun élément ne correspond à %0"});

merge(config.macros.tagging,{
 label: "éléments indexés:",
 labelNotTag: "pas d'index",
 tooltip: "Lister les éléments indexés '%0'"});

merge(config.macros.timeline,{
 dateFormat: "DD MMM YYYY"});

merge(config.macros.allTags,{
 tooltip: "Afficher les éléments indexés '%0'",
 noTags: "Pas d'éléments indexés"});

config.macros.list.all.prompt = "Tous les éléments par ordre alphabétique";
config.macros.list.missing.prompt = "Eléments désignés par un lien mais non créés";
config.macros.list.orphans.prompt = "Eléments ne faisant l'objet d'aucun lien";
config.macros.list.shadowed.prompt = "Eléments ayant un contenu par défaut";

merge(config.macros.closeAll,{
 label: "page blanche",
 prompt: "Retirer tous les éléments de l'affichage (sauf ceux en cours d'édition)"});

merge(config.macros.permaview,{
 label: "permavue",
 prompt: "URL de la page actuellement constituée"});

merge(config.macros.saveChanges,{
 label: "sauvegarde sur le disque",
 prompt: "Créer le fichier TiddlyWiki avec tous les éléments mis à jour - Raccourci : 'S'"});

merge(config.macros.newTiddler,{
 label: "nouveau",
 prompt: "Créer un nouvel élément",
 title: "EntréeNouvelle",
 accessKey: "N"});


merge(config.macros.importTiddlers,{
	defaultPath: "http://www.tiddlywiki.com/index.html",
	fetchLabel: "Accéder",
	fetchPrompt: "Accèder au fichier tiddlywiki",
	fetchError: "Problèmes rencontrés pour accéder au fichier tiddlywiki",
	confirmOverwriteText: "Confirmez l'écrasement de ces éléments :\n\n%0",
	wizardTitle: "Importation d'éléments depuis un autre fichier TiddlyWiki",
	step1: "Etape 1: Identification du fichier TiddlyWiki",
	step1prompt: "Saisir l'URL ou le chemin d'accès: ",
	step1promptFile: "...parcourez les fichiers: ",
	step1promptFeeds: "...ou sélectionnez une importation prédéfinie: ",
	step1feedPrompt: "Choisir...",
	step2: "Etape 2: Chargement des éléments du fichier TiddlyWiki",
	step2Text: "Patientez pendant le chargement des éléments de: %0",
	step3: "Etape 3: Choix des éléments à importer",
	step4: "%0 élément(s) importés",
	step5: "Terminé",
	listViewTemplate: {
		columns: [
			{name: 'Selected', field: 'Selected', rowName: 'title', type: 'Selector'},
			{name: 'Title', field: 'title', title: "Plugin", type: 'String'},
			{name: 'Snippet', field: 'text', title: "Extrait", type: 'String'},
			{name: 'Tags', field: 'tags', title: "Index", type: 'Tags'}
			],
		rowClasses: [
			],
		actions: [
			{caption: "Autres actions...", name: ''},
			{caption: "Importer ces éléments", name: 'import'}
			]}
	});

merge(config.macros.newJournal,{
 label: "journal",
 prompt: "Créer une nouvelle entrée ayant pour titre la date et l'heure",
 accessKey: "J"});

merge(config.macros.plugins,{
	skippedText: "(Extension non exécutée car ajoutée depuis le début de cette session)",
	noPluginText: "Il n'y a pas d'extensions installées",
	confirmDeleteText: "Confirmez-vous la suppression de ces éléments:\n\n%0",
	listViewTemplate : {
		columns: [
			{name: 'Selected', field: 'Selected', rowName: 'title', type: 'Selector'},
			{name: 'Title', field: 'title', tiddlerLink: 'title', title: "Extension", type: 'TiddlerLink'},
			{name: 'Forced', field: 'forced', title: "Forcée", tag: 'systemConfigForce', type: 'TagCheckbox'},
			{name: 'Disabled', field: 'disabled', title: "Désactivée", tag: 'systemConfigDisable', type: 'TagCheckbox'},
			{name: 'Executed', field: 'executed', title: "Chargée", type: 'Boolean', trueText: "Yes", falseText: "No"},
			{name: 'Error', field: 'error', title: "Etat", type: 'Boolean', trueText: "Error", falseText: "OK"},
			{name: 'Log', field: 'log', title: "Log", type: 'StringList'}
			],
		rowClasses: [
			{className: 'error', field: 'error'},
			{className: 'warning', field: 'warning'}
			],
		actions: [
			{caption: "Autres actions...", name: ''},
			{caption: "Supprimer l'index systemConfig", name: 'remove'},
			{caption: "Supprimer définitivement ces extensions", name: 'delete'}
			]}
	});


merge(config.commands.closeTiddler,{
 text: "fermer",
 tooltip: "Retirer cet élément de l'affichage"});

merge(config.commands.closeOthers,{
 text: "isoler",
 tooltip: "Refermer tous les autres éléments"});
merge(config.commands.editTiddler,{
 text: "éditer",
 tooltip: "Editer cet élément",
 readOnlyText: "voir",
 readOnlyTooltip: "Montrer le texte source de cet élément"});

merge(config.commands.saveTiddler,{
 text: "valider",
 tooltip: "Enregistrer les modifications apportées à cet élément"});

merge(config.commands.cancelTiddler,{
 text: "annuler",
 tooltip: "Abandonner les modifications apportées à cet élément",
 warning: "Confirmez-vous l'abandon des modifications de '%0'?",
 readOnlyText: "retour",
 readOnlyTooltip: "Revenir à l'affichage normal de cet élément"});

merge(config.commands.deleteTiddler,{
 text: "supprimer",
 tooltip: "Supprimer cet élément du fichier TiddlyWiki",
 warning: "Confirmez-vous la suppression de '%0'?"});

merge(config.commands.permalink,{
 text: "permalien",
 tooltip: "Permalien de cet élément"});

merge(config.commands.references,{
 text: "référents",
 tooltip: "Lister les éléments faisant référence à celui-ci",
 popupNone: "Pas de référents"});

merge(config.commands.jump,{
 text: "atteindre",
 tooltip: "Positionner l'affichage sur un autre élément déjà ouvert"});

merge(config.shadowTiddlers,{
 DefaultTiddlers: "PourCommencer",
 MainMenu: "PourCommencer",
 SiteTitle: "Mon TiddlyWiki",
 SiteSubtitle: "organiseur personnel web interactif",
 SiteUrl: "http://www.tiddlywiki.com/",
 PourCommencer: "Pour utiliser ce carnet TiddlyWiki, commencez par modifier les éléments suivants (//tiddlers// dans le jargon TiddlyWiki) :\n\n* SiteTitle & SiteSubtitle: Le titre et le sous-titre ci-dessus (après sauvegarde et rafraîchissement ils deviendront votre titre de page, qui s'affichera aussi dans la barre titre du navigateur)\n* MainMenu: Le menu (généralement à gauche)\n* DefaultTiddlers: Liste les noms des éléments que vous voulez voir s'afficher à l'ouverture de votre TiddlyWiki. \n\nEntrez également le nom utilisateur avec lequel seront signées chacune de vos entrées : <<option txtUserName>>",
 SideBarOptions: "<<search>><<closeAll>><<permaview>><<newTiddler>><<newJournal 'DD MMM YYYY'>><<saveChanges>><<slider chkSliderOptionsPanel OptionsPanel 'options »' 'Modifier les options avancées de ce TiddlyWiki'>>",
 OptionsPanel: "Vos options de configuration de TiddlyWiki sont sauvegardées par votre navigateur (cookies).\n\nNom d'utilisateur pour signer vos entrées : entrez-le sous la forme d'un nom Wiki (par exemple RaymondQueneau).<<option txtUserName>>\n<<option chkSaveBackups>>Backup de chaque version\n<<option chkAutoSave>>Sauvegarde automatique après chaque entrée validée\n<<option chkRegExpSearch>>Expression régulières dans les recherches\n<<option chkCaseSensitiveSearch>>Respecter la casse dans les recherches\n<<option chkAnimate>>Ouverture animée des éléments\n-----\n[[Importations|ImportTiddlers]]\n[[Extensions|PluginManager]]\n[[Options complémentaires|AdvancedOptions]]",
 AdvancedOptions: "<<option chkGenerateAnRssFeed>> Création flux RSS\n<<option chkOpenInNewWindow>> Ouverture des liens externes dans une nouvelle fenêtre\n<<option chkSaveEmptyTemplate>> Sauvegarde du fichier de base 'empty.html' de la dernière version\n<<option chkToggleLinks>> Recliquer sur un lien ferme l'élément qu'il a ouvert\n^^(hors fonction en appuyant sur la touche Ctrl)^^\n<<option chkHttpReadOnly>> Masque les fonctions d'édition lorsque le fichier est accédé depuis le Web\n<<option chkForceMinorUpdate>> L'entrée d'une modification ne modifie pas la date et l'heure déjà enregistrées pour l'élément\n^^(hors fonction en cliquant 'valider' avecla touche Maj enfoncée, ou en appuyant Ctrl-Maj-Entrée^^\n<<option chkConfirmDelete>> Confirmations avant suppressions\nNombre maximum de lignes de la fenêtre d'édition: <<option txtMaxEditRows>>\nRépertoire des backups : <<option txtBackupFolder>>\n",
 SideBarTabs: "<<tabs txtMainTab Chrono 'Affichage chronologique' TabTimeline Alpha 'Liste alphabétique des éléments' TabAll Index 'Liste des index' TabTags Suite 'Autres listes' TabMore>>",
 TabTimeline: "<<timeline>>",
 TabAll: "<<list all>>",
 TabTags: "<<allTags>>",
 TabMore: "<<tabs txtMoreTab Manquants 'Eléments désignés par un lien mais non créés' TabMoreMissing Orphelins 'Eléments sans liens pour les appeler' TabMoreOrphans Défauts 'Eléments ayant un contenu par défaut' TabMoreShadowed>>",
 TabMoreMissing: "<<list missing>>",
 TabMoreOrphans: "<<list orphans>>",
 TabMoreShadowed: "<<list shadowed>>"});

/*}}}*/
