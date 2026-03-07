/*{{{*/
// Possible Themes:
// "NeUIemTheme", "NeUIemTheme01", "NeUIemTheme02", "NeUIemTheme03", "TWDefaultTheme" 
config.options.txtTheme = "NeUIemTheme03"

// New tiddlers a private by default.
config.options.chkPrivateMode = true;

// A temporary hack, to activate transclusions again
 config.evaluateMacroParameters = "full";

// remove leading // at the lines below to aktivate left or right sidebar
// config.options.chkShowRightSidebar = false;		// false or true
// config.options.chkShowLeftSidebar  = false;		// false or true

// default config.taggly.config.excludeTags = ["excludeLists","excludeTagging"];
config.taggly.config.excludeTags = ["excludeTagging"];

// Set default tab to OpenId for login
config.options.txtLoginTab = 'OpenID';
/*}}}*/