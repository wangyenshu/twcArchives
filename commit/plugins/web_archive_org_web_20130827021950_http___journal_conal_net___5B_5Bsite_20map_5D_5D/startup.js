/***
|Synopsis|Customized startup code|
|Author|[[Conal Elliott|http://conal.net]]|
|Date|2006-12-31|
|Version|1.0|
|LoadDependencies|[[conditional WikiLink formatter]]|
!Description
Code to run at TiddlyWiki startup.  Some reusable code and initialization.

Uses [[conditional WikiLink formatter]] to make unknown WikiNames show up as regular text.  Well, no it doesn't.  I learned about DisableWikiLinksPlugin.  Besides, it may always suffice to use options in plugins instead of having a startup plugin like this one.
!Code
***/
//{{{
// My personal settings:
// findObject(config.formatters,'name',"wikiLink").linkIfUnknown = false;
//}}}
