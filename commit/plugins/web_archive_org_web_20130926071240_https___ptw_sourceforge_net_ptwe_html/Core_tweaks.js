/***
! CovertUnicodeToUTF8 for Markup* chunks
***/
//{{{
function updateMarkupBlock(s,blockName,tiddlerName)
{
	return s.replaceChunk(
			"<!--%0-START-->".format([blockName]),
			"<!--%0-END-->".format([blockName]),
			"\n" + convertUnicodeToUTF8(store.getRecursiveTiddlerText(tiddlerName,"")) + "\n");
}
//}}}