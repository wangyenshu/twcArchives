/%
|Description|Saving changes for online documents if the network goes down|
%/
{{small{
__Saving changes to online documents if your network connection goes down while editing__

If you have been editing a document online (e.g., using an account on http://www.TiddlySpot.com with [[UploadPlugin]]), and your internet connection has gone down while editing, it is not possible to save your changes in the usual manner because, without the internet, the remotely-stored document is //inaccessible//.

Unfortunately, you also cannot save the document locally because of security restrictions that prevent access to your local filesystem when working with a server-hosted document (i.e., viewed via http:).

Fortunately, there is a ''manual work-around that will let you 'rescue' TiddlyWiki's internal //storeArea// for the current document, including your unsaved changes to tiddler content'' by using the following command link:

{{big center{<<tiddler RescueStoreAreaCommand with: "rescue storeArea">>}}}
When clicked, this link ''opens a new window and writes a copy of the storeArea into that window.''  The content in that window is displayed as plain-text, and includes //only the storeArea DIVs that define the tiddlers, without any of the surrounding TiddlyWiki core code.//  To preserve this storeArea, ''select and copy/paste the displayed content into a local text file for safe-keeping.''

Then, to merge this 'rescued store area' with the rest of the TW core, use a plain-text editor (not the browser) to open a ''copy'' of any locally-stored TW document.  If a locally-stored TiddlyWiki document is not available, you will have to wait until your network connection has been re-established, so that you can download your TiddlyWiki document from the server, or [[obtain an empty TiddlyWiki document from http://www.TiddlyWiki.com|http://www.TiddlyWiki.com/empty.html]].

Then, find the 'storeArea' in that document, which looks like this:
{{{
<!--POST-SHADOWAREA-->
<div id="storeArea">
.... *** replace this part *** ...
</div>
<!--POST-STOREAREA-->
}}}
Select everything //inside the storeArea DIV//, and replace it with the rescued store area content, and then save the file.  If all goes well, the saved file can then be opened in your browser as a complete TW document, *with* all the saved content in place!

Note: The command link shown above may also be installed directly into your browser as an [[InstantBookmarklet|InstantBookmarklets]]. To create a bookmarklet, simply ''//drag-and-drop the command link directly onto your browser's toolbar//'' or right-click and use 'bookmark this link' (or 'add to favorites') to add the bookmarklet to your browser's bookmarks menu.  Once installed, you can use this command with //any// TiddlyWiki document, even when [[RescueStoreAreaCommand]] and [[InlineJavascriptPlugin]] have not been installed in that document!
}}}
