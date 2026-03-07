//{{{
config.macros.sectionTOC = {
	targetClass: 'sectionTOC',
	handler: function(place,macroName,params,wikifier,paramString,tiddler) {
		var out=[];
		var targetClass=params[0]||this.targetClass;
		var t=story.findContainingTiddler(place); if (!t) return;
		var elems=t.getElementsByTagName('*');
		var level=5; // topmost heading level
		for (var i=0; i<elems.length; i++) {
			var txt=getPlainText(elems[i]).trim();
			var link='[['+txt+'|##'+txt+']] <<editSection [[##'+txt+']] [[✏]]>>';
			switch(elems[i].nodeName) {
				case 'H1': out.push('#'+link);		level=1; break;
				case 'H2': out.push('##'+link);		level=level<2?level:2; break;
				case 'H3': out.push('###'+link);	level=level<3?level:3; break;
				case 'H4': out.push('####'+link);	level=level<4?level:4; break;
				case 'H5': out.push('#####'+link);	level=level<5?level:5; break;
				default: if (hasClass(elems[i],targetClass)) var target=elems[i];
			}
		}
		// trim excess bullet levels
		if (level>1) for (var i=0; i<out.length; i++) out[i]=out[i].substr(level-1);
		// show numbered list
		if (out.length && target) {
			if (target.style.display=='none') target.style.display='block';
			wikify(out.join('\n'),target);
		}
	}
}
//}}}