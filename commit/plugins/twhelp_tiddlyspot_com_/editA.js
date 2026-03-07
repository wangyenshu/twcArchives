config.tasks.viewTabs = {
	text: "editA",
	tooltip: "Edit a specific tiddler",
	content: "|width:18em;<<tiddler EditATiddler>>|"
};
config.backstageTasks.splice(config.backstageTasks.indexOf("save")+0,0,"viewTabs");
