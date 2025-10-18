/***
|Name|[[TiddlyFileImportr|TiddlyFileImportr]]|
|Version|0.2.7|
|Status|experimental|
|Source|https://github.com/jdlrobson/TiddlyWikiPlugins/tree/master/apps/fileimport|
|Latest|http://repository.tiddlyspace.com/TiddlyFileImportr|
***/
//{{{
var ImportWizard, WizardMaker;

(function($) {
window.WizardMaker = function(place, wizard) {
	var steps = wizard[0];
	var options = wizard[1] || {};
	$("<h1 />").text(options.heading || "Wizard").appendTo(place);
	var wizard = this;
	$('<button class="button">restart wizard</button>').click(function(ev) {
		wizard.jumpTo(0);
		}).appendTo(place)[0];
	this.currentStep = 0;
	this.body = $('<div class="wizardBody"/>').appendTo(place)[0];
	this.steps = steps;
	this.values = {};
	this.createStep(0);
};

WizardMaker.prototype = {
	/*
	OPTIONS
	step: [function, options]
	*/
	createStep: function(stepNumber) {
		$(this.body).empty();
		var step = this.steps[stepNumber];
		if(!step) {
			throw "invalid step (" + stepNumber + ")"
		}
		var options = step[1] || {};
		var humanStep = stepNumber + 1;
		var heading = "Step " + humanStep;
		if(options.heading) {
			heading += ": " + options.heading;
		}
		$("<h2 />").text(heading).appendTo(this.body);
		var container = $('<div class="wizardStep" />').appendTo(this.body)[0];
		step[0](container, this);
	},
	next: function() {
		if(this.currentStep < this.steps.length - 1) {
			this.currentStep += 1;
		}
		this.createStep(this.currentStep);
	},
	jumpTo: function(step) {
		this.currentStep = step;
		this.createStep(step);
	},
	setValue: function(name, val) {
		this.values[name] = val;
	},
	getValue: function(name) {
		return this.values[name];
	}
};

if(window.FileReader) {
	window.ImportWizard = function(options) {
		var proxy = options.proxy, saveFunction = options.save,
			internalizeTiddler = options.internalizeTiddler, proxyType = options.proxyType || "GET";
		return [
			[
				[function(body, wizard) {
					$(body).html('Where do you want to import from? <select><option value="1">file</option><option value="2">the web</option></select><button class="button">ok</button>');
					$("button", body).click(function(ev) {
						var opt = $("select", body).val();
						if(opt === "1") {
							wizard.next();
						} else {
							wizard.jumpTo(2);
						}
					});
				},
				{ heading: "File or Web?" }],
				[function(body, wizard) {
					$(body).html('Browse for a file: <input type="file" size="50" name="txtBrowse"><br><hr><div class="wizardFooter"><div class="message"></div></div>');
					function handleFileSelect(evt) {
						reader = new FileReader();
						reader.onerror = function(e, msg) {
							alert("Error occurred")
						};
						reader.onabort = function(e) {
							alert('File read cancelled');
						};
						reader.onload = function(e) {
							var html = reader.result;
							wizard.setValue("html", html);
							wizard.jumpTo(3)
						}
						// Read in the image file as a binary string.
						window.reader = reader;
						reader.readAsText(evt.target.files[0]);
					}
					$("[type=file]", body)[0].addEventListener('change', handleFileSelect, false);
				}, { heading: "Locate TiddlyWiki file" }],
				[function(body, wizard) {
					$(body).html('Enter the URL or pathname here: <div class="message"></div><input type="text" size="50" name="txtPath"><button class="button">open</button>');

					$("button", body).click(function(ev) {
						var url = proxy.replace("%0", $("input", body).val())
						ajaxReq({
							type: options.proxyType,
							url: url,
							success: function(html) {
								wizard.setValue("html", html);
								wizard.jumpTo(3);
							},
							error: function() {
								$(".message").html("There is something wrong with that url please try another.");
								$("input", body).addClass("error");
							}
						})
					})
				},
				{ heading: "Import from Web" }],
				[function(body, wizard) {
					var html = wizard.getValue("html");
					var doc = $(html);
					var store;
					$(html).each(function(i, el) {
						if(el.id === "storeArea") {
							store = el;
						}
					});
					if(store) {
						var tiddlers = [];
						$(store).children().each(function(i, el) {
							var title = $(el).attr("title");
							tiddlers.push(internalizeTiddler(el));
						});
						$("<div />").text("Choose tiddlers that you wish to import");
						var table = $("<table />").appendTo(body)[0];
						$("<tr />").html('<th><input type="checkbox" checked/></th><th>title</th>').
							appendTo(table)
						$("input", table).change(function(ev) {
							var checked = $(ev.target).is(':checked');
							$("input[type=checkbox]", body).attr("checked", checked);
						});
						for(var i = 0; i < tiddlers.length; i++) {
							var title = tiddlers[i].title;
							var row = $("<tr />").data("tiddler", tiddlers[i]).appendTo(table)[0];
							$("<td />").html('<input type="checkbox" checked="checked"/>').appendTo(row);
							$("<td />").text(title).appendTo(row);
						}
						$('<button class="button">import all selected tiddlers</button>').click(function(ev) {
							var tids = [];
							$("input[type=checkbox]:checked").each(function(i, chk) {
								var tiddler = $(chk).parents("tr").data("tiddler");
								if(tiddler) {
									tids.push(tiddler);
								}
							});
							wizard.setValue("selected", tids);
							wizard.jumpTo(4)
						}).prependTo(body);
					}
				},
				{ heading: "Choose tiddlers" }],
				[function(body, wizard) {
					var tids = wizard.getValue("selected");
					$(body).text("Please wait");
					// do import
					var save = 0;
					var complete = function() {
						save += 1;
						if(save === tids.length) {
							wizard.jumpTo(5);
						}
					};
					$(body).text("Please wait (Importing " + tids.length + " tiddlers)");
					for(var i = 0; i < tids.length; i++) {
						var tid = tids[i];
						$(body).text("Please wait (Importing " + tid.title + ")");
						saveFunction(tid, complete);
					}
				},
				{ heading: "Importing" }],
				[function(body, wizard) {
					$(body).html("Good news! Everything is now imported.");
				},
				{ heading: "Finished!" }]
			],
			{
				heading: "Import tiddlers from another file or server"
			}
		];
	}
} else {
  $("#container").addClass("error").text("Your browser is not modern enough to support this app.");
}

})(jQuery);
(function($) {

if(window.ImportWizard) {
	var proxy = "%0", proxyType = "GET";
	if(config.extensions.tiddlyspace) {
		proxy = "/reflector?uri=%0";
		proxyType: "POST";
	}
	var loader = new TW21Loader();
	var internalizer = function(node) {
		var title = $(node).attr("title");
		var tiddler = new Tiddler(title);
		loader.internalizeTiddler(store, tiddler, title, node);
		return tiddler;
	};

	var importer = ImportWizard({proxy:"%0", save: function(tid, callback) {
		merge(tid.fields, config.defaultCustomFields);
		delete tid.fields["server.page.revision"];
		delete tid.fields["server.etag"];
		tid = store.saveTiddler(tid.title, tid.title, tid.text,
			tid.modifier, tid.modified, tid.tags, tid.fields, null, tid.created, tid.creator);
		autoSaveChanges(null, [tid]);
		callback();
	}, internalizeTiddler: internalizer, proxyType: proxyType });

	config.macros.importTiddlers = {
		handler: function(place) {
			var container = $("<div />").appendTo(place)[0];
			new WizardMaker(container, importer);
		}
	};
} else if(config.macros.importTiddlers) {
	var _import = config.macros.importTiddlers.handler;
	config.macros.importTiddlers.handler = function(place) {
		_import.apply(this, arguments);
		jQuery("<div class='annotation error' />").text("Please upgrade your browser to take advantage of the modernised file import mechanism of the TiddlyFileImportr plugin.").prependTo(place);
	};
}

})(jQuery);
//}}}