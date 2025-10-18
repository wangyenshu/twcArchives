// // override cookie settings for CalendarPlugin:
//{{{
config.options.txtCalFirstDay=6;
config.options.txtCalStartOfWeekend=5;
//}}}
//{{{
config.options.txtDateLinkFormat = 'YYYY-MM-DD';// 'dated tiddler' link format
config.options.txtDateDisplayFormat = 'YYYY.0MM.0DD';//default date display format
//}}}

// // override internal default settings for CalendarPlugin:
//{{{
config.macros.calendar.journalDateFmt="0DD/0MM/YYYY";
config.options.txtWeekNumberLinkFormat = 'ugeWW';
config.options.txtWeekNumberDisplayFormat = 'ugeWW';
config.options.chkDisplayWeekNumbers='true'
config.macros.calendar.monthnames=['Januar','Februar','Marts','April','Maj','Juni','Juli','August','September','Oktober','November','December'];
config.macros.calendar.daynames=['Ma','Ti','On','To','Fr','Lø','Sø'];
var c=config,cc=c.commands,cm=c.macros,cmg=c.messages,cv=c.views,cl=c.macros.list,cve=cv.editor;

//}}}