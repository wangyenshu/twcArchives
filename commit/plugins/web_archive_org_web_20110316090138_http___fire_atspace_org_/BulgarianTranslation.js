config.options.txtUserName = "ВашетоИме";

config.shadowTiddlers.SideBarOptions = "<<search>><<closeAll>><<permaview>><<saveChanges>><<slider chkSliderOptionsPanel OptionsPanel настройки 'Промяна на експертни настроки'>>";
config.shadowTiddlers.OptionsPanel = "Тук можете да промените външният вид и държането на TiddlyWiki. Вашите промени се запазват автоматично от браузъра.\n\nВашето име с което да подписвате промените. Използвайте WikiWord (например JoeBloggs)\n\n<<option txtUserName>>\n<<option chkSaveBackups>> Пази резервно копие\n<<option chkAutoSave>> Автоматично запазване\n<<option chkGenerateAnRssFeed>> Генерирай RSS\n<<option chkRegExpSearch>> Използване на регулярни изрази\n<<option chkCaseSensitiveSearch>> Главни, малки букви имат значение при търсене\n<<option chkAnimate>> Използвай анимация\n\nВиж [[Експертни настройки|AdvancedOptions]]";
config.shadowTiddlers.AdvancedOptions = "<<option chkOpenInNewWindow>> Отваряй връзките в нов прозорец\n<<option chkSaveEmptyTemplate>> Запазване на празен шаблон\n<<option chkToggleLinks>> Избиране на отворен tiddler го затваря.\n^^(override with Control or other modifier key)^^";
config.shadowTiddlers.SideBarTabs = "<<tabs txtMainTab История 'Хронологична история на tiddler-ите' TabTimeline Всички 'Всички тагове' TabTags Още 'Още..' TabMore>>";
config.shadowTiddlers.TabMore = "<<tabs txtMoreTab Всички 'Всички tiddler-и' TabMoreAll Липсващи 'Липсващи tiddler-и' TabMoreMissing Нецитирани 'Нецитирани tiddler-и' TabMoreOrphans>>";

config.messages.customConfigError = "Грешка в потребителска конфигурация - %0";
config.messages.savedSnapshotError = "Изглежда TiddlyWiki е било некоректно записано. Моля, погледнете http://www.tiddlywiki.com/#DownloadSoftware за детайли";
config.messages.subtitleUnknown = "(непознат)";
config.messages.undefinedTiddlerToolTip = "Tiddler с име '%0' все още не съществува";
config.messages.externalLinkTooltip = "Връзка към друг сайт - %0";
config.messages.noTags = "There are no tagged tiddlers";
config.messages.notFileUrlError = "Трябва да запазите това TiddlyWiki във файл, преди да записвате промените";
config.messages.cantSaveError = "Промените не могат да бъдат запазени, защото вашият браузър е неподдържан. Използвайте FireFox, ако е възможно.";
config.messages.invalidFileError = "Оригиналният файл '%0' изглежда не е валидно TiddlyWiki";
config.messages.backupSaved = "Запазено е резервно копие";
config.messages.backupFailed = "Грешка при запис на резервното копие";
config.messages.rssSaved = "RSS feed saved";
config.messages.rssFailed = "Failed to save RSS feed file";
config.messages.emptySaved = "Запазен е празен шаблон";
config.messages.emptyFailed = "Грешка при записване на празен шаблон";
config.messages.mainSaved = "Файлът е запазен успешно";
config.messages.mainFailed = "Грешка при запис на файла. Вашите промени не са запазени";
config.messages.macroError = "Грешка при изпълнение на макрос '%0'";
config.messages.overwriteWarning = "Тiddler с име '%0' вече съществува. Изберете 'OK' за да го презапишете";
config.messages.unsavedChangesWarning = "ВНИМАНИЕ! Вашите промени не са запазени\n\nИзберете 'OK' за да ги запазите\nИзберете 'CANCEL' за отмяна";
config.messages.dates.months = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември","Декември"];
config.messages.dates.days = ["Неделя", "Понеделник","Вторник", "Сряда", "Четвъртък", "Петък", "Събота"];


config.views.wikified.tag.labelNoTags = "няма категория";
config.views.wikified.tag.labelTags = "категория: ";
config.views.wikified.tag.tooltip = "Покажи всички tiddler-и от категория '%0'";
config.views.wikified.tag.openAllText = "Отвори всички tiddler-и от категория '%0'";
config.views.wikified.tag.openAllTooltip = "Отвори всички тези tiddler-и";
config.views.wikified.tag.popupNone = "Няма други tiddler-и в категория '%0'";

config.views.wikified.toolbarClose.text = "затвори";
config.views.wikified.toolbarClose.tooltip = "Затваряне/скриване на tiddler-a";
config.views.wikified.toolbarEdit.text = "редактиране";
config.views.wikified.toolbarEdit.tooltip = "Редактиране на съдържанието на тiddler-а";
config.views.wikified.toolbarPermalink.text = "директна връзка";
config.views.wikified.toolbarPermalink.tooltip = "Отваряне на директна връзка към този tiddler";
config.views.wikified.toolbarReferences.text = "препратки";
config.views.wikified.toolbarReferences.tooltip = "Покажи tiddler-и, които имат препратка към текущият";
config.views.wikified.toolbarReferences.popupNone = "Няма препратки";
config.views.wikified.defaultText = "Tiddler-ът '%0' все още не съществува. Кликнете два пъти с мишката за да го създадете.";

config.views.editor.tagPrompt = "Използвайте категории, разделени със интервал. Използвайте [[двойни скоби]] ако е необходимо.";
config.views.editor.tagChooser.text = "Категория";
config.views.editor.tagChooser.tooltip = "Изберете категория";
config.views.editor.tagChooser.popupNone = "Няма дефинирани категории";
config.views.editor.tagChooser.tagTooltip = "Използвай категория '%0'";
config.views.editor.toolbarDone.text = "Запис";
config.views.editor.toolbarDone.tooltip = "Запазване на промените";
config.views.editor.toolbarCancel.text = "Отказ";
config.views.editor.toolbarCancel.tooltip = "Игнориране на направените промени и изход от режим редактиране";
config.views.editor.toolbarDelete.text = "Изтриване";
config.views.editor.toolbarDelete.tooltip = "Премахване на tiddler-a";
config.views.editor.defaultText = "Тук можете да попълните съдържанието на '%0'";


config.macros.search.label = "Търсене";
config.macros.search.prompt = "Търсене във съдържанието на TiddlyWiki";
config.macros.search.successMsg = "Търсения низ '%1' е открит в %0 tiddler-а";
config.macros.search.failureMsg = "Няма tiddler, който отговарят на търсеният низ '%0'";
config.macros.allTags.tooltip = "Показване на тидлери от категория '%0'";
config.macros.allTags.noTags = "Няма дефинирани категории";
config.macros.list.all.prompt = "Сортирани в азбучен ред";
config.macros.list.missing.prompt = "Tiddler-и, към които има препратки, но самите те не съществуват";
config.macros.list.orphans.prompt = "Tiddler-и, които същесвуват, но към тях няма нито една препратка";
config.macros.closeAll.label = "затвори всичко";
config.macros.closeAll.prompt = "Затваряне на всички показани tiddler-и (с изключение на тези, които в момента се редактират)";
config.macros.permaview.label =  "директна връзка";
config.macros.permaview.prompt = "Директна връзка към текущо отвореният tiddler.";
config.macros.saveChanges.label = "запис на промените";
config.macros.saveChanges.prompt = "Записване на всички tiddler-и, за да създадете ново TiddlyWiki";
config.macros.newTiddler.label = "нов tiddler";
config.macros.newTiddler.prompt = "Създаване на нов tiddler";
config.macros.newJournal.label = "нов журнал";
config.macros.newJournal.prompt = "Създаване на нов журнал за текущият ден и час";
