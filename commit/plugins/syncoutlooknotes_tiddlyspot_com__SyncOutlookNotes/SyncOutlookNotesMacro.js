config.macros.SyncOutlookNotes = 
{
 handler: function()
 {
/**
 * Outlook Constants
 * http://www.winscripter.com
 * http://www.winscripter.com/WSH/MSOffice/93.aspx
 **/

/* OlDefaultFolders Constants*/
var olFolderDeletedItems = 3;
var olFolderOutbox = 4;
var olFolderSentMail = 5;
var olFolderInbox = 6;
var olFolderCalendar = 9;
var olFolderContacts = 10;
var olFolderJournal = 11;
var olFolderNotes = 12;
var olFolderTasks = 13;

/* OlFlagStatus Constants */
var olNoFlag = 0;
var olFlagComplete = 1;
var olFlagMarked = 2;

/* OlFolderDisplayMode Constants */
var olFolderDisplayNormal = 0;
var olFolderDisplayFolderOnly = 1;
var olFolderDisplayNoNavigation = 2;

/* OlImportance Constants */
var olImportanceLow = 0;
var olImportanceNormal = 1;
var olImportanceHigh = 2;

/* OlInspectorClose Constants */
var olSave = 0;
var olDiscard = 1;
var olPromptForSave = 2;

/* OlItems Constants */
var olMailItem = 0;
var olAppointmentItem = 1;
var olContactItem = 2;
var olTaskItem = 3;
var olJournalItem = 4;
var olNoteItem = 5;
var olPostItem = 6;

/* OlJournalRecipientsType Constants */
var olAssociatedContact = 1; 
/* OlNoteColor Constants */
var olBlue = 0;
var olGreen = 1;
var olPink = 2;
var olYellow = 3;
var olWhite = 4;
/* OlSaveAsType Constants */
var olTXT = 0;
var olRTF = 1;
var olTemplate = 2;
var olMSG = 3;
var olDoc = 4;

/* OlSensitivity Constants */
var olNormal = 0;
var olPersonal = 1;
var olPrivate = 2;
var olConfidential = 3;

/* OlUserPropertyType Constants */
var olText = 1;
var olNumber = 3;
var olDateTime = 5;
var olYesNo = 6;
var olDuration = 7;
var olKeywords = 11;
var olPercent = 12;
var olCurrency = 14;
var olFormula = 18;
var olCombination = 19;

var updateSyncDate = 1;
var lastSyncDate = new Date(1); // just after the beginning of the epoch
var syncDateTiddler;// = store.getTiddler("LastSyncDate");
if(store.getTiddler("LastSyncDate")) {
 //alert("using LastSyncDate tiddler");
 syncDateTiddler = store.getTiddler("LastSyncDate");
 lastSyncDate = syncDateTiddler.modified;
} else {
 alert("LastSyncDate tiddler does not exist - creating");
 var newT = store.createTiddler("LastSyncDate");
 var nowDate = new Date();
 newT.set("LastSyncDate", "This tiddler's update time is when we synced last - so please don't update it manually as it may cause incorrect sync behavior.", 'Mike', lastSyncDate, "Macros", nowDate);
 syncDateTiddler = store.getTiddler("LastSyncDate");
}
 
var theApp = new ActiveXObject("Outlook.Application");
var theNameSpace = theApp.GetNamespace("MAPI");
theApp.ActiveExplorer.CurrentFolder = theNameSpace.GetDefaultFolder(olFolderNotes)
var theFolder = theApp.ActiveExplorer.CurrentFolder;
var theOItems = theFolder.Items;
var thecount = theFolder.Items.Count;
var theTList = store.getTiddlers("title");

alert("Moving Outlook items to TiddlyWiki (and sync of objects in both locations)");
for(var oi=1; oi<= theFolder.Items.Count; oi++) {
 var haveMatch = 0;
 // We first check if this is a delete operation as denoted by
 // having a TWDELETE at the of the beginning of the text

 var oNoteString = theFolder.Items(oi).Body;
 oNoteString = oNoteString.substring(oNoteString.indexOf("\n")+1,oNoteString.length);

 oTitle = theFolder.Items(oi).Subject;
 var deleteRE = /^TWDELETE/;

 if(deleteRE.test(oNoteString)) {
 alert("Deleting entry: " + oTitle);
 theFolder.Items(oi).Delete();
 store.removeTiddler(oTitle);
 continue; // skip the rest of processing the outlook object.
 }// end the if(delete) function 

 for(var ti=0; ti<theTList.length;ti++) {
 if(theTList[ti].title == theFolder.Items(oi).Subject) {
 haveMatch = 1;

 // perform sync operation

 // first, we figure out if they are different. There's some weridness
 // between the data in outlook and in the Wiki, so for simplicity
 // we strip all whitespace and compare those strings. This means
 // that whitespace changes won't be synced, even if they are relevent
 // to the wiki markup, which is unfortunate.
 // We also have to include the tags so that if the user changes the
 // tags, it updates both sides. This is tricky as the order might
 // not be preserved in outlook or tiddlywiki
 //
 // The body compare also has the nice side effect that for those of
 // us who have "delete everything unmodified after 6 months", we can
 // have a script to update the dates in outlook and it doesn't
 // propigate those new dates to the TiddlyWiki.
 //

 oNoteString = oNoteString + theFolder.Items(oi).Categories.split(", ").sort().join(" ")
 var whiteRE = /\s+/g;
 tNoteString = theTList[ti].text + theTList[ti].tags.sort().join(" ");
 var compOString = oNoteString.replace(whiteRE, "");
 var compNString = tNoteString.replace(whiteRE, "");
 if(compOString != compNString) {

 // OK - so the text is different, try and figure out which one to
 // use based on the last modified dates.
 if((theTList[ti].modified > lastSyncDate) &&
 ( theFolder.Items(oi).LastModificationTime > lastSyncDate)) {
 // both have changed and they don't match - we've got an issue
 alert("Both Outlook and TiddlyWiki have changed the note titled: "+theTList[ti].title+ "\nScript is not doing anything (not intellegent enough). Manually merge, delete one of the two and resync\nDates:\n\tLastSyncDate:\t" + lastSyncDate + "\n\tTiddlyWiki:\t" + theTList[ti].modified + "\n\tOutlook:\t" + theFolder.Items(oi).LastModificationTime);
 return;
 }else if (theTList[ti].modified > lastSyncDate) {
 // just the wiki changed, move the body over
 alert("just the wiki changed for " + theTList[ti].title);
 var newBodyString = theTList[ti].title
 newBodyString = newBodyString + "\n" + theTList[ti].text;
 theFolder.Items(oi).Body = newBodyString;
 theFolder.Items(oi).Categories = theTList[ti].tags.sort().join(", ");
 theFolder.Items(oi).Save();
 }else if (theFolder.Items(oi).LastModificationTime > lastSyncDate) {
 // just outlook changed, move the body over
 alert("just the Outlook note changed for " + theTList[ti].title);
 var oNoteString = theFolder.Items(oi).Body;
 oNoteString = oNoteString.substring(oNoteString.indexOf("\n")+1,oNoteString.length);
 oCatString = theFolder.Items(oi).Categories;
 commasRE = /\,\s*/g;
 var nowDate = new Date();
 theTList[ti].set(theFolder.Items(oi).Subject, oNoteString, 'Mike', nowDate, oCatString.replace(commasRE," "));
 } else {
 // dates not helpful - need user help
 alert("Sync dates are not newer, but text does not match for the note/tiddler titled: "+theTList[ti].title+ "\nNot doing anything. Please manually merge if necessary, delete one of the two and resync\n---\n" + compNString + "\n---\n" + compOString + "\n---\n");
 return;
 } // end of the date checking if/else clause
 } // end of if(text different)
 break;
 } // end if(i/j titles match)
} // end inner for loop

 if(haveMatch == 0) {
 alert("Creating new Tiddler for: " + theFolder.Items(oi).Subject);
 var newT = store.createTiddler(theFolder.Items(oi).Subject);
 var nowDate = new Date();
 var oNoteString = theFolder.Items(oi).Body;
 oNoteString = oNoteString.substring(oNoteString.indexOf("\n")+1,oNoteString.length);
 oCatString = theFolder.Items(oi).Categories;
 commasRE = /\,\s*/g;
 newT.set(theFolder.Items(oi).Subject, oNoteString, 'Mike', nowDate, oCatString.replace(commasRE," "), nowDate);
 } // end if(no match)
haveMatch =0;
} // end outer for loop

alert("now syncing new TiddlyWiki objects to Outlook");
for(var ti=0; ti<theTList.length;ti++) {
 var haveMatch = 0;
 // We first check if this is a delete operation as denoted by
 // having a TWDELETE at the end of the beginning of the text
 var twTitle = theTList[ti].title;
 var twText = theTList[ti].text;
 var deleteRE = /^TWDELETE/;
 if(deleteRE.test(twText)) {
 alert("Deleting entry: " + twTitle);
 store.removeTiddler(twTitle);
 for(var oi=1;oi<=theFolder.Items.Count; oi++) {
 if(twTitle == theFolder.Items(oi).Subject) {
 theFolder.Items(oi).Delete();
 break;
 } // if match titles
 } // end for loop
 continue; // skip the rest of processing the outlook object.
 } // end the if(delete) function 

 for(var oi=1;oi<=theFolder.Items.Count; oi++) {
 if(twTitle == theFolder.items(oi).subject) {
 haveMatch = 1;
 // we've already synced matching objects in the previous loop...
 break;
 }
 }
 if(haveMatch == 0) {
 alert("creating new note with name: " + theTList[ti].title);
 var newNote = theApp.CreateItem(olNoteItem);
 var newBodyString = theTList[ti].title
 newBodyString = newBodyString + "\n" + theTList[ti].text;
 newNote.Body = newBodyString;
 newNote.Categories = theTList[ti].tags.sort().join(", ");
 newNote.Save();
 }
}

 alert('Cross-sync done, updating LastSyncDate');
 var nowDate = new Date();
 // Add one minute because the date stored doesn't include seconds.
 var msDate = nowDate.valueOf() + 60000
 nowDate = new Date(msDate);
 syncDateTiddler.set("LastSyncDate", "This tiddler's update time is when we synced last - so please don't update it manually as it may cause incorrect sync behavior.", 'Mike', nowDate);
 }
}
