This github action archives the Tiddlywiki Classic plugins and themes from the systemServer stored in systemServer.txt. And it generates extension description file compatible with https://github.com/YakovL/TiddlyWiki_ExtensionsExplorerPlugin. Finally, it saves plugins, themes, description files in commit folder and commit to twcArchives branch.
It use https://github.com/TiddlyWiki/cooker to extract plugins and themes.

The wayback machine has a rate limit. So it will sleep for 60 seconds before archiving the next url.

The workflow file archive.yml use ruby1.8 and https://github.com/TiddlyWiki/cooker. It works for most wikis. The workflow file archives_patched_ginsu.yml use modern(3.x) version of ruby and my patched version of ginsu https://github.com/wangyenshu/cooker. But it only works for very few wikis.

Issue:
The workflow archive.yml commits everything to twcArchives branch, including .github folder.

!Credit
https://github.com/TiddlyWiki/cooker
https://github.com/YakovL/TiddlyWiki_ExtensionsExplorerPlugin
https://launchpad.net/~brightbox/+archive/ubuntu/ruby-ng
