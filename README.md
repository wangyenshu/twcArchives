This github action archives the Tiddlywiki Classic plugins and themes from the systemServer stored in systemServer.txt everyday. And it generates extension description file compatible with https://github.com/YakovL/TiddlyWiki_ExtensionsExplorerPlugin. Finally, it saves plugins, themes, description files in commit folder and commit to twcArchives branch.
It use https://github.com/TiddlyWiki/cooker to extract plugins and themes.

The wayback machine has a rate limit. So it will sleep for 120 seconds before archiving the next url.

The workflow file archive.yml use ruby1.8 and https://github.com/TiddlyWiki/cooker. It works for most wikis. The workflow file archives_patched_ginsu.yml use modern(3.x) version of ruby and my patched version of ginsu https://github.com/wangyenshu/cooker. But it only works for very few wikis.

## Issue/Todo
- The workflow archive.yml commits everything to twcArchives branch, including .github folder.
- No automatic version system. There is a manual version system. You can adjust the variable VERSION to set the version.
- Improve algorithmn to find the 'description' of plugins and themes.
- Find and fill in the LegalStatements of the remaining systemServers.

## Credit
- https://github.com/TiddlyWiki/cooker
- https://github.com/YakovL/TiddlyWiki_ExtensionsExplorerPlugin
- https://launchpad.net/~brightbox/+archive/ubuntu/ruby-ng
- https://github.com/stefanzweifel/git-auto-commit-action

## LegalStatements
This workflow file is licensed under MIT LICENSE. However, the plugins and themes from the list of systemServers are subject to their own license.
| Server Name | URL | LegalStatements |
|---|---|---|
| AbegoSoftwareServer | https://tiddlywiki.abego-software.de/ | https://www.abego-software.de/legal/apl-v10.html |
| BidiXTWServer | https://web.archive.org/web/20130801155706/http://tiddlywiki.bidix.info/ | Unkown |
| BobsPluginsServer | https://web.archive.org/web/20171113084110/http://bob.mcelrath.org/plugins.html#tag:systemConfig | Unkown |
| MartinsPluginsServer | http://web.archive.org/web/20120321101358/http://www.martinswiki.com/ | http://creativecommons.org/licenses/by-sa/2.5/ |
| MonkeyPirateTWServer | https://mptw.tiddlyspot.com/ | http://mptw.tiddlyspot.com/#TheBSDLicense |
| PeachTWServer | https://bradleymeck.tiddlyspot.com/ | Unkown |
| PrinceTiddlyWikiExtensionsServer | https://web.archive.org/web/20200224151452/https://ptw.sourceforge.net/ptwe.html | Creative Commons Attribution-ShareAlike 2.5 License |
| RedMountainVistaServer | http://solo.dc3.com/tw/ | http://creativecommons.org/licenses/by-sa/2.5/ |
| TiddlyStylesServer | https://web.archive.org/web/20140127010925/http://tiddlystyles.com:80/ | Unkown |
| TiddlyToolsServer | https://tiddlytools.com/Classic/ | https://tiddlytools.com/Classic/#LegalStatements |
| VisualTWServer | https://yakovl.github.io/VisualTW2/VisualTW2.html | https://yakovl.github.io/VisualTW2/VisualTW2.html#License |
| TBD | TBD | TBD |
