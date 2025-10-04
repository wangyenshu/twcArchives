/***
| Name:|AudioPlayerPlugin|
| Author:|[[Conal Elliott|http://conal.net]]|
| Version:|1.0.0, 2006-11-15|
!Examples
<<audioPlayer http://www.cnvc.org/downlds/20020510.mp3>>
<<marshallism 20020329>>
{{{
<<audioPlayer http://www.cnvc.org/downlds/20020510.mp3>>
<<marshallism 20020329>>
}}}
!History
* 1.0.0 (2006-11-15): first release
!Code
***/
//{{{
version.extensions.AudioPlayerMacro = {
	major: 1,
	minor: 0,
	revision: 0,
	date: new Date(2006,11,15),
	source: "..."
};

config.macros.audioPlayer = {
  player: function(url) {
    return "<html><iframe src=\"http://mail.google.com/mail/html/audio.swf?audioUrl="+url+"\" style=\"width: 250px; height: 25px; border: 1px solid #aaa;\" id=musicPlayer></iframe></html>";
  },
  play: function (url,place) {
    wikify(config.macros.audioPlayer.player(url),place);
  },
  handler: function (place,macroName,params,wikifier,paramString,tiddler) {
    config.macros.audioPlayer.play(params[0],place);
  }
}
config.macros.marshallism = {
  handler: function (place,macroName,params,wikifier,paramString,tiddler) {
    config.macros.audioPlayer.play("http://www.cnvc.org/downlds/"+params[0]+".mp3",place);
  }
}

// Use with a slider.  Doesn't work :(.  The player doesn't materialize.
config.macros.playerSlider = {
  play: function(label,url,place) {
    wikify("+++["+label+"]"+config.macros.audioPlayer.player(url)+"=== ",place);
  },
  handler: function (place,macroName,params,wikifier,paramString,tiddler) {
    config.macros.playerSlider.play(params[0],params[0],place);
  }
}
config.macros.mbr= {
  handler: function (place,macroName,params,wikifier,paramString,tiddler) {
    config.macros.playerSlider.play(params[0],"http://www.cnvc.org/downlds/"+params[1]+".mp3",place);
  }
}

//}}}
