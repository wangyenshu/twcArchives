/***
|''Name:''|TrashPlugin|
|''Version:''|1.1.0 (Dec 12, 2006) |
|''Source:''|http://ido-xp.tiddlyspot.com/#TrashPlugin|
|''Author:''|Ido Magal (idoXatXidomagalXdotXcom)|
|''Licence:''|[[BSD open source license]]|
|''CoreVersion:''|2.1.0|
|''Browser:''|??|

!Description
This plugin provides trash bin functionality.  Instead of being permanently removed, deleted tiddlers are tagged with "Trash."  Empty the trash by clicking on the <<emptyTrash>> button in the [[Trash]] tiddler. Holding down CTRL while clicking on "delete" will bypass the trash.

!Installation instructions
Create a new tiddler in your wiki and copy the contents of this tiddler into it.  Name it the same and tag it with "systemConfig".
Save and reload your wiki.

!Uninstallation instructions
1. Empty the [[Trash]] ( <<emptyTrash>> )
2. Delete this tiddler.

!Revision history
* V1.1.0 (Dec 12, 2006) 
** added movedMsg (feedback when tiddler is tagged as Trash)
** make sure tiddler actually exists before tagging it with "Trash"
** fetch correct tiddler before checking for "systemConfig" tag
* V1.0.3TT.1 (TiddlyTools variant) (Dec 11, 2006) 
** don't create Trash tiddler until needed
** remove Trash tiddler when no trash remains
** don't tag Trash tiddler with "TrashPlugin"
** moved all user-visible strings to variables so they can be translated by 'lingo' plugins
** use displayMessage() instead of alert()
* v1.0.3 (Dec 11, 2006)
** Fixed broken reference to core deleteTiddler.
** Now storing reference to core deleteTiddler in emptyTrash macro.
** Reduced deleteTiddler hijacking to only the handler.
* v1.0.2 (Dec 11, 2006)
** EmptyTrash now uses removeTiddler instead of deleteTiddler.
** Supports trashing systemConfig tiddlers (adds systemConfigDisable tag).
* v1.0.1 (Dec 10, 2006)
** Replaced TW version with proper Core reference.
** Now properly hijacking deleteTiddler command.
* v1.0.0 (Dec 10, 2006)
** First draft.

!To Do
* Make trash keep only n days worth of garbage.
* Add undo.
* rename deleted tiddlers?

!Code
***/
//{{{

config.macros.emptyTrash = 
{
	tag: "Trash",
	movedMsg: "'%0' has been tagged as '%1'",
	label: "empty trash",
	tooltip: "Delete items tagged as %0 that are older than %1 days old",
	emptyMsg: "The trash is empty.",
	noneToDeleteMsg: "There are no items in the trash older than %0 days.",
	confirmMsg: "The following tiddlers will be deleted:\n\n'%0'\n\nIs it OK to proceed?",
	deletedMsg: "Deleted '%0'",

	handler: function ( place,macroName,params,wikifier,paramString,tiddler )
	{
		var namedParams = (paramString.parseParams(daysOld))[0];
		var daysOld = namedParams['daysOld'] ? namedParams['daysOld'][0] : 0; // default
		var buttonTitle = namedParams['title'] ? namedParams['title'][0] : this.label;
		createTiddlyButton ( place, buttonTitle, this.tooltip.format([ config.macros.emptyTrash.tag,daysOld ]),
		this.emptyTrash( daysOld ));
	},

	emptyTrash: function( daysOld )
	{
		return function()
		{
			var collected = [];
			var compareDate = new Date();
			compareDate.setDate( compareDate.getDate() - daysOld );
			store.forEachTiddler(function ( title,tiddler )
			{
				if ( tiddler.tags.contains( config.macros.emptyTrash.tag ) && tiddler.modified < compareDate )
					collected.push( title );
			});

			if ( collected.length == 0 )
			{
				if ( daysOld == 0 )
					displayMessage( config.macros.emptyTrash.emptyMsg );
				else
					displayMessage( config.macros.emptyTrash.emptyMsg.format( [daysOld] ) );
			}
			else {
				if (	confirm( config.macros.emptyTrash.confirmMsg.format( [collected.join( "', '" )] ) ) )
				{
					for ( var i=0;i<collected.length;i++ )
					{
						store.removeTiddler( collected[i] );
						displayMessage( config.macros.emptyTrash.deletedMsg.format( [collected[i]] ) );
					}
				}
			}
			// remove Trash tiddler if no trash remains
			if ( store.getTaggedTiddlers( config.macros.emptyTrash.tag ).length == 0 ) {
				story.closeTiddler( config.macros.emptyTrash.tag,true,false);
				store.removeTiddler( config.macros.emptyTrash.tag );
			}
			else
				story.refreshTiddler( config.macros.emptyTrash.tag,false,true );
			store.setDirty( true );
		}
	}
}

////////////////// hijack delete command

config.macros.emptyTrash.orig_deleteTiddler_handler = config.commands.deleteTiddler.handler;
config.commands.deleteTiddler.handler = function( event,src,title )
	{
		// if tiddler exists (i.e., not a NEW, unsaved tiddler in edit mode) and not bypassing Trash (holding CTRL key)
		if ( store.tiddlerExists( title ) && !event.ctrlKey )
		{
			// if Trash tiddler doesn't exist yet, create it now...
			if (!store.tiddlerExists( config.macros.emptyTrash.tag ))
				store.saveTiddler( config.macros.emptyTrash.tag,config.macros.emptyTrash.tag,
					"<<emptyTrash>>","TrashPlugin",new Date(),null );
			// set tags on tiddler
			store.setTiddlerTag( title,1,config.macros.emptyTrash.tag );
			store.setTiddlerTag( title,1,"excludeLists" );
			store.setTiddlerTag( title,1,"excludeMissing" );
			var tiddler=store.fetchTiddler(title);
			if (tiddler.tags.contains( "systemConfig" ))
				store.setTiddlerTag( title,1,"systemConfigDisable" );
			// close tiddler, autosave file (if set), and give user feedback
			story.closeTiddler( title,true,event.shiftKey || event.altKey );
			if( config.options.chkAutoSave )
				saveChanges();
			displayMessage(config.macros.emptyTrash.movedMsg.format( [ title,config.macros.emptyTrash.tag ] ));
		}
		else {
			config.macros.emptyTrash.orig_deleteTiddler_handler.apply( this, arguments );
		}
		story.refreshTiddler( config.macros.emptyTrash.tag,false,true );
		return false;
	};
//}}}