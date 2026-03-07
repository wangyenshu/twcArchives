/***
|''Source:''|http://ziddlywiki.com/forum#CommentPlugin|
|''Credit:''|Tim Morgan|

''Adds "comments" to any TiddlyWiki or adaptation.'' To use, copy this tiddler's contents to a new tiddler on your site and tag it {{{systemConfig}}}.  Used in conjunction with the RecentPlugin, one can have a decent forum environment.
***/
//{{{
config.CommentPlugin = {
  only_on_tags: [],
  not_on_tags: ['about'],
  // "true" or "false"...
  fold_comments: true,
  default_fold: false
};

function in_array(item, arr){for(var i=0;i<arr.length;i++)if(item==arr[i])return true};
function one_in_array(items, arr){for(var i=0;i<items.length;i++)if(in_array(items[i], arr))return true;return false};
function get_parent(tiddler){while(in_array('comments', tiddler.tags)) tiddler=store.fetchTiddler(tiddler.tags[0]);return tiddler};
function count_comments(tiddler){var tagged=store.getTaggedTiddlers(tiddler.title);var count=0;for(var i=0;i<tagged.length;i++)if(in_array('comments', tagged[i].tags)){count++;count+=count_comments(tagged[i])}return count};
config.shadowTiddlers.ViewTemplate += "\n<div class='comments' macro='comments'></div>";
config.shadowTiddlers.StyleSheetLayout += '\n.commentTags ul{list-style:none; padding-left:0px;margin: 0 0 3px 0;} .commentTags li{display:inline;color:#999;} .commentTags li a.button{color:#999;} .comment{border-left:1px solid #ccc; margin-top:10px; margin-left:10px; padding:5px;} .newCommentLink{padding-top:10px} .tagging, .selected .tagging, .tiddler .tagging{display:none;} .comment a.button{padding:0px; font-size:smaller;}';
config.macros.newCommentLink = {
  label: 'New Comment Here...',
  prompt: 'Create a new comment tiddler associated with this tiddler',
  handler: function(place,macroName,params,wikifier,paramString,tiddler) {
    if(tiddler && store.tiddlerExists(tiddler.title) && !readOnly && (!window.zw || zw.loggedIn || zw.anonEdit)) {
      if(config.CommentPlugin.only_on_tags.length>0 && !one_in_array(tiddler.tags, config.CommentPlugin.only_on_tags)) return;
      if(config.CommentPlugin.not_on_tags.length>0 && one_in_array(tiddler.tags, config.CommentPlugin.not_on_tags)) return;
      var onclick = function(e) {
        if (!e) var e = window.event;
	var theTarget = resolveTarget(e);
        if(tiddler.title.indexOf(' Comment ')>-1) var title = tiddler.title.split(' Comment ')[0];
        else var title = tiddler.title;
        var title = title + ' Comment ' + (new Date()).formatString('YYYY-0MM-0DD 0hh:0mm:0ss');
        var comment = store.createTiddler(title);
        comment.text = '';
        comment.tags = [tiddler.title, 'comments', 'excludeLists'];
        story.displayTiddler(theTarget, title, DEFAULT_EDIT_TEMPLATE);
        story.focusTiddler(title,"text");
        return false;
      }
      createTiddlyButton(place, this.label, this.prompt, onclick);
    }
  }
};
config.macros.comments = {
  dateFormat: 'DD MMM YYYY hh:0mm',
  handler: function(place,macroName,params,wikifier,paramString,tiddler) {
    if(tiddler.title=='comments') return;
    var comments = store.getTaggedTiddlers(tiddler.title, 'created');
    if(comments.length>0 && !in_array('comments', tiddler.tags) && config.CommentPlugin.fold_comments) {
      var show = createTiddlyElement(place, 'p');
      show.innerHTML = '<a href="#" onclick="var e=document.getElementById(\'comments'+tiddler.title+'\');e.style.display=e.style.display==\'block\'?\'none\':\'block\';return false;">Comments ('+count_comments(tiddler)+') &raquo;</a>';
    }
    var place = createTiddlyElement(place, 'div', 'comments'+tiddler.title, 'comments');
    if(comments.length>0 && !in_array('comments', tiddler.tags) && config.CommentPlugin.fold_comments && config.CommentPlugin.default_fold)
      place.style.display = 'none';
    else
      place.style.display = 'block';
    for(var i=0; i<comments.length; i++) {
      if(!in_array('comments', comments[i].tags))continue;
      var container = createTiddlyElement(place, 'div', null, 'comment');
      var title = createTiddlyElement(container, 'strong');
      var link = createTiddlyLink(title, comments[i].modifier, true);
      createTiddlyElement(title, 'span', null, null, ', '+comments[i].created.formatString(this.dateFormat));
      if(comments[i].modifier == config.options.txtUserName) {
        createTiddlyElement(title, 'span', null, null, ' (');
        var edit = createTiddlyLink(title, comments[i].title);
        edit.innerHTML = 'edit';
        createTiddlyElement(title, 'span', null, null, ')');
      }
      createTiddlyElement(container, 'br');
      config.macros.tiddler.handler(container, null, [comments[i].title]);
      createTiddlyElement(container, 'br');
      config.macros.comments.handler(container,null,null,null,null,comments[i]);
    }
    config.macros.newCommentLink.handler(place,null,null,null,null,tiddler);
  }
};
var CPCloseTiddlers = [];
TiddlyWiki.prototype.CommentPlugin_saveTiddler = TiddlyWiki.prototype.saveTiddler;
TiddlyWiki.prototype.saveTiddler = function(title,newTitle,newBody,modifier,modified,tags) {
  var t = this.CommentPlugin_saveTiddler(title,newTitle,newBody,modifier,modified,tags);
  var tags = tags.split(/\s+/g);
  if(in_array('comments', tags)) {
    var original = config.CommentPlugin.default_fold;
    config.CommentPlugin.default_fold = false;
    story.refreshTiddler(get_parent(t).title, DEFAULT_VIEW_TEMPLATE, true);
    config.CommentPlugin.default_fold = original;
    CPCloseTiddlers.push(newTitle);
    setTimeout("story.closeTiddler(CPCloseTiddlers.pop(), true)", 1000);
  }
  return t;
};
//}}}