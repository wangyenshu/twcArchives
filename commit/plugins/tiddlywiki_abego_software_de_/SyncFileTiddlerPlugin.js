/***
|''Name:''|SyncFileTiddlerPlugin|
|''Summary:''|Automatically synchronizes the text of a tiddler with the content of an associated text file.|
|''Version:''|1.0.0 (2012-04-16)|
|''Source:''|http://tiddlywiki.abego-software.de/#SyncFileTiddlerPlugin|
|''Author:''|UdoBorkowski (ub [at] abego-software [dot] de)|
|''Licence:''|[[BSD open source license (abego Software)|http://www.abego-software.de/legal/apl-v10.html]]|
|''Copyright:''|&copy; 2012 [[abego Software|http://www.abego-software.de]]|
!About SyncFileTiddler
SyncFileTiddler automatically synchronizes the text of a tiddler with the content of an associated text file.

The tiddlers to be synched are specified in a table in the tiddler SyncFileTiddlers. A table entry looks like this:
{{{
|SomeTiddler|path/To/File.txt|readonly|
}}}
This will be rendered as:
|SomeTiddler|path/To/File.txt|readonly|
When the "readonly" parameter is missing the tiddler is editable. Changes to the tiddler's text will be written to the associated file.
When "readonly" is specified the tiddler is not editable in the TiddlyWiki, but changes in the associated file will also change the tiddler's text accordingly.
The file is regularily read ("polled") to verify if its text has changed.

The tags of the tiddler can only be specified in the TiddlyWiki. The file will not affect the tags.
!Revision history
* SyncFileTiddlerPlugin 1.0.0 (2012-04-16)
** initial version
!Source Code
***/
//{{{
var abego = abego || {};

(function(namespace) {
	var entries = {};

	var errorMsg = function(s) {
		throw "SyncFileTiddler: " + s;
	};

	var save = function(filepath, s) {
		var b = saveFile(filepath, s);
		if (!b) {
			throw errorMsg("file could not be saved: " + filepath);
		}
		return s;
	};

	var createTiddler = function(title, text) {
		var t = store.createTiddler(title);
		t.text = text;
		return text;
	};

	var getTiddlerText = function(title) {
		return store.getTiddlerText(title, null);
	};

	var setTiddlerText = function(title, text) {
		var t = store.fetchTiddler(title);
		store.saveTiddler(title, title, text, "SyncFileTiddler ("
				+ config.options.txtUserName + ")", new Date(), t.fields.tags);
		return text;
	};

	/**
	 * FIXME: also implement the "delete" case, i.e. delete the "Slave" when the
	 * "Master" is missing (need a deleteFile method first). (? What about
	 * losing tags when deleting the tiddler after a file delete?)
	 *
	 * @param oldFileContent
	 *            [nullable] when not null it holds the content of the file as
	 *            it was loaded "some time ago". Before the method overwrites
	 *            the file it checks if the file still has the oldFileContent.
	 *            If the file's current content differs from the oldFileContent,
	 *            the file was modified "from the outside". Then we have a sync
	 *            conflict and the method fails.
	 * @param fileIsMaster
	 *            when true the file is the Master, i.e. the tiddler should get
	 *            the file's content. When false the file should get the
	 *            tiddler's content. When undefined the function should try to
	 *            find out what is the Master.
	 * @return [nullable] the text/content of the Tiddler/File, or null if
	 *         neither Tiddler nor File exists
	 */
	var syncTiddlerAndFile = function(tiddler, filepath, oldFileContent,
			fileIsMaster) {
		var tiddlerContent = getTiddlerText(tiddler);
		var fileContent = loadFile(filepath);

		if (fileContent) {
			fileContent = fileContent.replace(/\r\n/g,'\n');

			if (tiddlerContent) {
				// both file and tiddler exist.

				if (fileContent == tiddlerContent) {
					// both file and tiddler are equal
					return fileContent;

				} else {
					// file and tiddler differ.
					if (fileIsMaster === undefined) {
						// No Master is explicitly defined.
						throw errorMsg("tiddler and file have different content (delete the 'old' one to fix this):\n"
								+ tiddler + "\n" + filepath);

					} else if (fileIsMaster) {
						// the file is the master, i.e. the tiddler gets the
						// file's content
						return setTiddlerText(tiddler, fileContent);

					} else {
						// the tiddler is the master, i.e. the file gets the
						// tiddler's text

						// But first check if the file was not modified in the
						// meantime
						if (oldFileContent && oldFileContent != fileContent) {
							throw errorMsg("The file was modified externally: "
									+ filepath);
						}
						return save(filepath, tiddlerContent);
					}
				}
			} else {
				// file exists, but no tiddler.

				// Create a new tiddler with the fileContent
				return createTiddler(tiddler, fileContent);
			}
		} else {
			if (tiddlerContent) {
				// tiddler exists, but no file.

				// create a file with the tiddler's content
				return save(filepath, tiddlerContent);
			} else {
				// Neither tiddler nor file exists.

				// do nothing
				return null;
			}
		}
	};

	var syncEntry = function(entry, fileIsMaster, ignoreOldFileContent) {
		if (entry.readonly && !fileIsMaster) {
			return false;
		}

		entry.oldFileContent = syncTiddlerAndFile(entry.tiddler,
				entry.filepath, ignoreOldFileContent ? null
						: entry.oldFileContent, fileIsMaster);
		return true;
	};

	var saveAsFile = function(tiddler) {
		var e = entries[tiddler];
		if (e) {
			var s = getTiddlerText(tiddler);
			save(e.filepath, s);
			e.oldFileContent = s;
		}
	};

	// When a tiddler is saved and it is a "SyncFileTiddler" the corresponding
	// file is updated.
	var oldSaveTiddler = TiddlyWiki.prototype.saveTiddler;
	TiddlyWiki.prototype.saveTiddler = function(title, newTitle) {
		var result = oldSaveTiddler.apply(this, arguments);

		try {
			// "Sync" the tiddler with its file, with the tiddler being the
			// Master.
			// (Will do nothing if the tiddler is not a "SyncFileTiddler")
			SyncFileTiddler.syncTiddler(newTitle, false);
		} catch (e) {
			if (confirm("The file to sync with was modified externally.\n\n"
					+ "Press OK to overwrite anyway.\n"
					+ "Press Cancel to keep file unchanged.")) {
				saveAsFile(newTitle);
			} else if (confirm("Use the file's content as the tiddler text?")) {
				syncEntry(entries[newTitle], true);
			}
		}
		return result;
	};

	// The tiddler must be readonly when its "sync" entry is readonly
	var oldIsReadOnly = Tiddler.prototype.isReadOnly;

	Tiddler.prototype.isReadOnly = function() {
		if (oldIsReadOnly.apply(this, arguments)) {
			return true;
		}
		var e = entries[this.title];
		return e && e.readonly;
	}

	var pauseBetweenFilePolls = 2000;
	var polling = false;
	var pollFileChanges = function() {
		if (polling) {
			SyncFileTiddler.syncAll(true);

			// schedule the next time to poll for file changes
			setTimeout(pollFileChanges, pauseBetweenFilePolls);
		}
	};

	var SyncFileTiddler = {

		/**
		 * The tiddler is registered to be "synched" with the file.
		 *
		 * If a tiddler is added more than once the last file specified is used.
		 *
		 * @param tiddler
		 *            title of the tiddler to register
		 * @param filepath
		 *            path to the file to associate with the tiddler.
		 */
		add : function(tiddler, filepath, readonly) {
			if (!filepath.startsWith("/")) {
				// a path relative to the document
				var docPath = document.URL;
				if (!docPath.startsWith("file://"))
					return;
				var p = docPath.substring(7, docPath.lastIndexOf("/") + 1);
				filepath = p + filepath;
			}

			entries[tiddler] = {
				tiddler : tiddler,
				filepath : filepath,
				readonly : readonly,
				oldFileContent : syncTiddlerAndFile(tiddler, filepath, null,
						true),
			};
		},

		/**
		 * "Syncs" the tiddler with its file.
		 *
		 * Will do nothing when the tiddler is not a "FileSyncTiddler" (i.e. was
		 * not registered using add)
		 */
		syncTiddler : function(tiddler, fileIsMaster) {
			var e = entries[tiddler];
			if (e) {
				syncEntry(e, fileIsMaster);
				autoSaveChanges(true);
				return true;
			} else {
				return false;
			}
		},

		syncAll : function(fileIsMaster) {
			for ( var e in entries) {
				syncEntry(entries[e], fileIsMaster);
			}
			autoSaveChanges(true);
		},

		setPolling : function(b) {
			if (b == polling)
				return;

			polling = b;
			if (polling) {
				// start polling
				pollFileChanges();
			}
		},

		isPolling : function() {
			return polling;
		},

		setPauseBetweenFilePolls : function(millis) {
			pauseBetweenFilePolls = millis;
		},

		getPauseBetweenFilePolls : function() {
			return pauseBetweenFilePolls;
		},

		addSyncFileTiddlers : function() {
			var s = store.getTiddlerText("SyncFileTiddlers");
			if (!s)
				return;

			var lines = s.split("\n");
			for ( var i = 0; i < lines.length; i++) {
				var line = lines[i];
				var a = line.split('\|');
				if (a.length >= 3) {
					var tiddler = a[1];
					var filepath = a[2];
					var readonly = a.length >= 4 && a[3]=="readonly";
					SyncFileTiddler.add(tiddler, filepath,readonly);
				}
			}
		}
	};

	namespace.SyncFileTiddler = SyncFileTiddler;

})(abego);

setTimeout(function() {
	abego.SyncFileTiddler.addSyncFileTiddlers();
	abego.SyncFileTiddler.setPolling(true);
},1);
//}}}
