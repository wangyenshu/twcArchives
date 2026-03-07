/***
|!''Name:''|!''socialBookmark''|
|''Description:''|This macro will produce links to most of the social bookmarking sites<<br>>These will allow for quick posting of the current tiddler<<br>>feel free to (un)comment lines that begin with {{{SocialBookmark.addDestination}}} below to adapt it to your needs<<br>>you'll see an example output by looking at the bottom of most TWkd tiddlers (as i included the macro in my ViewTemplate)|
|''Version:''|0.2.0|
|''Date:''|22/03/2007|
|''Source:''|http://yann.perrin.googlepages.com/twkd.html#socialBookmark|
|''Author:''|[[Yann Perrin|YannPerrin]]|
|''License:''|[[BSD open source license]]|
|''~CoreVersion:''|2.x|
|''Browser:''|Firefox 1.0.4+; Firefox 1.5; InternetExplorer 6.0|
|''Requires:''|@@color:red;''Send''@@|
***/
//{{{
window.SocialBookmark=new window.TWkd.Send("socialBookmark","::");
SocialBookmark.addDestination("Delicious","http://del.icio.us/post?v=4;url=%0;title=%1","http://yann.perrin.googlepages.com/delicious.png");
SocialBookmark.addDestination("Digg","http://digg.com/submit?phase=2&amp;url=%0&amp;title=%1","http://yann.perrin.googlepages.com/digg.png");
//SocialBookmark.addDestination("Blink","http://www.blinklist.com/index.php?Action=Blink/addblink.php&amp;Url=%0&amp;Title=%1","http://yann.perrin.googlepages.com/blinklist.png");
//SocialBookmark.addDestination("Newsvine","http://www.newsvine.com/_tools/seed&amp;save?u=%0&amp;h=%1","http://yann.perrin.googlepages.com/newsvine.png");
//SocialBookmark.addDestination("Furl","http://www.furl.net/storeIt.jsp?u=%0&amp;t=%1","http://yann.perrin.googlepages.com/furl.png");
//SocialBookmark.addDestination("Fark","http://cgi.fark.com/cgi/fark/edit.pl?new_url=%0&amp;new_comment=%1&amp;new_comment=%1&amp;linktype=Misc","http://yann.perrin.googlepages.com/fark.png");
//SocialBookmark.addDestination("BlogMarks","http://blogmarks.net/my/new.php?mini=1&amp;simple=1&amp;url=%0&amp;title=%1","http://yann.perrin.googlepages.com/blogmarks.png");
SocialBookmark.addDestination("Yahoo! MyWeb","http://myweb2.search.yahoo.com/myresults/bookmarklet?t=%1&u=%0&ei=UTF-8","http://yann.perrin.googlepages.com/yahoomyweb.png");
//SocialBookmark.addDestination("BlinkBits","http://www.blinkbits.com/bookmarklets/save.php?v=1&amp;source_url=%0&amp;title=%1;body=%1","http://yann.perrin.googlepages.com/blinkbits.png");
//SocialBookmark.addDestination("Connotea","http://www.connotea.org/addpopup?continue=confirm&amp;uri=%0&amp;title=%1","http://yann.perrin.googlepages.com/connotea.png");
//SocialBookmark.addDestination("Del.irio.us","http://de.lirio.us/rubric/post?uri=%0;title=%1;when_done=go_back","http://yann.perrin.googlepages.com/delirious.png");
//SocialBookmark.addDestination("FeedMeLinks","http://feedmelinks.com/categorize?from=toolbar&amp;op=submit&amp;url=%0&amp;name=%1","http://yann.perrin.googlepages.com/feedmelinks.png");
//SocialBookmark.addDestination("LinkaGoGo","http://www.linkagogo.com/go/AddNoPopup?url=%0&amp;title=%1","http://yann.perrin.googlepages.com/linkagogo.png");
//SocialBookmark.addDestination("Ma.gnolia","http://ma.gnolia.com/beta/bookmarklet/add?url=%0&amp;title=%1&amp;description=%1","http://yann.perrin.googlepages.com/magnolia.png");
//SocialBookmark.addDestination("Netvouz","http://www.netvouz.com/action/submitBookmark?url=%0&amp;title=%1&amp;description=%1","http://yann.perrin.googlepages.com/netvouz.png");
//SocialBookmark.addDestination("Rawsugar","http://www.rawsugar.com/tagger/?turl=%0&amp;tttl=%1","http://yann.perrin.googlepages.com/rawsugar.png");
SocialBookmark.addDestination("Reddit","http://reddit.com/submit?url=%0&amp;title=%1","http://yann.perrin.googlepages.com/reddit.png");
//SocialBookmark.addDestination("Scuttle","http://www.scuttle.org/bookmarks.php/maxpower?action=add&amp;address=%0&amp;title=%1&amp;description=%1","http://yann.perrin.googlepages.com/scuttle.png");
//SocialBookmark.addDestination("Shadows","http://www.shadows.com/features/tcr.htm?url=%0&amp;title=%1","http://yann.perrin.googlepages.com/shadows.png");
//SocialBookmark.addDestination("Simpy","http://www.simpy.com/simpy/LinkAdd.do?href=%0&amp;title=%1","http://yann.perrin.googlepages.com/simpy.png");
//SocialBookmark.addDestination("Smarking","http://smarking.com/editbookmark/?url=%0&amp;description=%1","http://yann.perrin.googlepages.com/smarking.png");
//SocialBookmark.addDestination("Spurl","http://www.spurl.net/spurl.php?url=%0&amp;title=%1","http://yann.perrin.googlepages.com/spurl.png");
//SocialBookmark.addDestination("TailRank","http://tailrank.com/share/?text=&amp;link_href=%0&amp;title=%1","http://yann.perrin.googlepages.com/tailrank.png");
//}}}
