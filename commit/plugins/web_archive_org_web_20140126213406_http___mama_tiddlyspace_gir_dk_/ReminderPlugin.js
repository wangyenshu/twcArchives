/***
|''Name:''|ReminderPlugin|
|''Version:''|2.3.11 (Oct 17, 2009)|
|''Source:''|http://remindermacros.tiddlyspot.com|
|''Author:''|Jeremy Sheeley(pop1280 [at] excite [dot] com) / Modded: Tobias Beer|
|''Licence:''|[[BSD open source license]]|
|''Macros:''|reminder, showreminders, displayTiddlersWithReminders, newReminder|
|''TiddlyWiki:''|2.0+|
|''Browser:''|Firefox 1.0.4+; InternetExplorer 6.0|
@@color:red;massively modded for tbGTD!  ...shrinked code| dateformat | list format + prefix@@
!Description
This plugin provides macros for tagging a date with a reminder. Use the {{{reminder}}} macro to do this. 
The macros {{{showReminders}}} and {{{displayTiddlersWithReminder}}} search through all available tiddlers looking for upcoming reminders.
!Code
***/
//{{{
version.extensions.ReminderPlugin={major:2,minor:3,revision:11,date:new Date(209,10,17),source:"http://remindermacros.tiddlyspot.com/"};

//========== Configuration... modify this section to change the defaults for  leadtime and display strings
config.macros["reminder"]={};
config.macros["newReminder"]={};
config.macros["showReminders"]={};
config.macros["displayTiddlersWithReminders"]={};

config.macros.reminders={
	defaultLeadTime:[-365,6000],
	defaultReminderMessagePrefix:"@@padding-right:5px;color:"+store.getTiddlerSlice('ColorPalette','SecondaryMid')+";''påmindelse&#58;''@@",
	defaultReminderMessage:"DATE ANNIVERSARY @@color:"+store.getTiddlerSlice('ColorPalette','TertiaryMid')+";(DIFF)@@@@padding:0 3px;TITLE@@",
	defaultShowReminderMessagePrefix:"|noborder|k\n", //|__''hvornår''__|__''hvad''__|__''tiddler''__|\n",
	defaultShowReminderMessage:"|DATE ANNIVERSARY @@color:"+store.getTiddlerSlice('ColorPalette','TertiaryMid')+";(DIFF)@@|TITLE|<<tag TIDDLER>>|",
	defaultAnniversaryMessage:"(DIFF)",
	untitledReminder:"påmindelse uden titel",
	noReminderFound:"Overdue reminder? Couldn't find a match for 'TITLE' in the next LEADTIMEUPPER days.",
	todayString:"Idag",
	tomorrowString:"Imorgen",
	ndaysString:"DIFF days",
	dateFormat:"MMM. DD",
	emtpyShowRemindersString:"ingen kommende begivenheder",
	txtRemindTip:"åben en formular for at tilføje en ny påmindelse til denne tiddler",
	txtRemind:"påmind",
	txtTitle:"Skriv venligst en titel",
	txtEachYear:"Hvert år",
	txtEachMonth:"Hver måned",
	txtEachDay:"Hver dag"
}

//========== Code... no need to edit below!
//holds the cache of reminders, so that we don't recompute the same reminder over again
var reminderCache={};
config.macros.showReminders.handler=function showReminders(place,macroName,params){
	var lead=[0,14];
	var now=new Date().getMidnight();
	var r=getParamsForReminder(params);
	var hasDate=r["year"]!=null||r["month"]!=null||r["day"]!=null||r["dayofweek"]!=null;
	if(r["leadtime"]!=null){
		lead=r["leadtime"];
		//If they've entered a day, we need to make sure to find it
		if(hasDate)r["leadtime"]=[-10000,10000];
	}
	var match=now;
	if(hasDate){
		var LBound=new Date().getMidnight().addDays(r["leadtime"][0]);
		var UBound=new Date().getMidnight().addDays(r["leadtime"][1]);
		match=findDateForReminder(r,new Date().getMidnight(),LBound,UBound);
	}
	
	var arr=findTiddlersWithReminders(match,lead,r["tag"],r["limit"]);
	var el=createTiddlyElement(place,"span",null,null,null);
	var msg="";
	c=config.macros.reminders;
	if(arr.length==0)msg+=c.emtpyShowRemindersString;
	else msg+=!r["format"]||r["format"]&&!r["formatprefix"]?c.defaultShowReminderMessagePrefix:r["formatprefix"]; //tbGTD
	for(var x=0;x<arr.length;x++){
		var t=arr[x];
	  if(r["format"]!=null)t["params"]["format"]=r["format"];
	  else arr[x]["params"]["format"]=c.defaultShowReminderMessage;
	  msg+=getReminderMessageForDisplay(t["diff"],t["params"],t["matchedDate"],t["tiddler"]);
	  msg+="\n";
	}
	wikify(msg,el,null,null);
};


config.macros.displayTiddlersWithReminders.handler=function displayTiddlersWithReminders(place,macroName,params){
	var now=new Date().getMidnight();
	var lead=[0,14];
	var r=getParamsForReminder(params);
	var hasDate=r["year"]!=null||r["month"]!=null||r["day"]!=null||r["dayofweek"]!=null;
	if(r["leadtime"]!=null){
		lead=r["leadtime"];
		//If they've entered a day, make sure to find it 
		if(hasDate)r["leadtime"]=[-10000,10000];
	}
	var match=now;
	if(hasDate){
		var LBound=new Date().getMidnight().addDays(r["leadtime"][0]);
		var UBound=new Date().getMidnight().addDays(r["leadtime"][1]);
		match=findDateForReminder(r,new Date().getMidnight(),LBound,UBound);
	}
	var arr=findTiddlersWithReminders(match,lead,r["tag"],r["limit"]);
	for(var x=0;x<arr.length;x++)displayTiddler(null,arr[x]["tiddler"],0,null,false,false,false);
};

config.macros.reminder.handler=function reminder(place,macroName,params){
	var set=config.macros.reminders;
	var r=getParamsForReminder(params);
	if(r["hidden"]!=null)return;
	var lead=r["leadtime"];
	var c=config.macros.reminders;
	if(lead==null)lead=c.defaultLeadTime;
	var LBound=new Date().getMidnight().addDays(lead[0]);
	var UBound=new Date().getMidnight().addDays(lead[1]);
	var match=findDateForReminder(r,new Date().getMidnight(),LBound,UBound);
	var tid=story.findContainingTiddler(place);if(!tid)return;
	var title=tid.getAttribute('tiddler');
	if(match!=null){
		var diff=match.getDifferenceInDays(new Date().getMidnight());
		var el=createTiddlyElement(place,"span",null,set.txtRemind,null);
		var msg=c.defaultReminderMessagePrefix+getReminderMessageForDisplay(diff,r,match,title);
		wikify(msg,el,null,null);
	}else createTiddlyElement(place,"span",null,"remind",c.noReminderFound.replace("TITLE",r["title"]).replace("LEADTIMEUPPER",lead[1]).replace("LEADTIMELOWER",lead[0]).replace("TIDDLERNAME",title).replace("TIDDLER","[["+title+"]]"));
}

config.macros.newReminder.handler=function newReminder(place,macroName,params){
  var set=config.macros.reminders;
  var today=new Date().getMidnight();
  var out='<html><form id="addReminderForm"><select name="year"><option value="">'+set.txtEachYear+'</option>';
  for(var i=0;i<5;i++)
		out+='<option'+(i==0?' selected':'')+' value="'+(today.getFullYear()+i)+'">'+(today.getFullYear()+i)+'</option>';
		out+='</select><select name="month"><option value="">'+set.txtEachMonth+'</option>';
  for(i=0;i<12;i++)
		out+='<option'+(i==today.getMonth()?' selected':'')+' value="'+(i+1)+'">'+config.messages.dates.months[i]+'</option>';
		out+='</select><select name="day"><option value="">'+set.txtEachDay+'</option>';
  for(i=1;i<32;i++)
		out+='<option'+(i==today.getDate()?' selected':'')+' value="'+i+'">'+i+'</option>';
		out+='</select><input type="text" size="25" name="title" value="'+set.txtTitle+'" onfocus="this.select();"><input type="button" value="ok" onclick="addReminderToTiddler(this.form)"></form></html>';
  var panel=config.macros.slider.createSlider(place,null,set.txtRemind,set.txtRemindTip);
  wikify(out,panel,null,store.getTiddler(params[1]));
}

// onclick: process input and insert reminder at 'marker'
window.addReminderToTiddler=function(form){
	if(!store.getTiddler)store.getTiddler=function(title){return this.tiddlers[title];};
	var title=story.findContainingTiddler(form).getAttribute('tiddler');
	var tiddler=store.getTiddler(title);
	var add='\n<<reminder ';
	if(form.year.value!="")add+='year:'+form.year.value+' ';
	if(form.month.value!="")add+='month:'+form.month.value+' ';
	if(form.day.value!="")add+='day:'+form.day.value+' ';
	add+='title:"'+form.title.value+'" ';
	add+='>>';
	tiddler.set(null,tiddler.text+add);
	form.parentNode.parentNode.previousSibling.onclick(); //tbGTD: close form when done processing
	story.refreshTiddler(title,1,true);
	store.setDirty(true);
};

function hasTag(tags,filters){
	//Make sure we respond well to empty tiddlerTaglists or tagFilterlists
	if(filters.length==0||tags.length==0)return true;
	var bHasTag=false;
	var bNoPos=true;
	for(var t3=0;t3<filters.length;t3++){
		for(var t2=0;t2<tags.length;t2++){
			if(filters[t3].length>1&&filters[t3].charAt(0)=='!'){
				//If at any time a negative filter is matched, we return false
				if(tags[t2]==filters[t3].substring(1))return false;
			}else{
				//We encountered the first positive filter
				if(bNoPos)bNoPos=false;
				//A positive filter is matched. As long as no negative filter is matched, hasTag will return true
				if(tags[t2]==filters[t3])bHasTag=true;
			}
		}
	}
	return (bNoPos||bHasTag);
};

window.findTiddlersWithReminders=function findTiddlersWithReminders(base,lead,tags,limit){
	var expr=new RegExp("<<(reminder)(.*)>>","mg");
	var matches=store.search(expr,"title","");
	var arr=[];
	var arrTags=null;
	//allows tags with spaces. thanks Robin Summerhill, 4-Oct-06.
	if(tags!=null)arrTags=tags.readBracketedList();
	for(var t=matches.length-1;t>=0;t--){
		if(arrTags!=null&&!hasTag(matches[t].tags,arrTags))continue;
		var targetText=matches[t].text;
		do{
			// Get the next formatting match
			var match=expr.exec(targetText);
			if(match&&match[1]!=null&&match[1].toLowerCase()=="reminder"){
				//Find the matching date.
				var params=match[2]!=null ? match[2].readMacroParams():{};
				var r=getParamsForReminder(params);
				if(limit!=null||r["leadtime"]==null){
					if(lead==null)r["leadtime"]=lead;
					else{
						r["leadtime"]=[];
						r["leadtime"][0]=lead[0];
						r["leadtime"][1]=lead[1];
					}
				}
				if(r["leadtime"]==null)r["leadtime"]=config.macros.reminders.defaultLeadTime;
				var LBound=base.addDays(r["leadtime"][0]);
				var UBound=base.addDays(r["leadtime"][1]);
				var found=findDateForReminder(r,base,LBound,UBound);
				while(found!=null){
					var tmp={};
					tmp["diff"]=found.getDifferenceInDays(base);
					tmp["matchedDate"]=new Date(found.getFullYear(),found.getMonth(),found.getDate(),0,0);
					tmp["params"]=cloneParams(r);
					tmp["tiddler"]=matches[t].title;
					tmp["tags"]=matches[t].tags;
					arr.pushUnique(tmp);
					if(r["recurdays"]!=null||(r["year"]==null)){
						LBound=LBound.addDays(found.getDifferenceInDays(LBound)+ 1);
						found=findDateForReminder(r,base,LBound,UBound);
					}
					else found=null;
				}
			}
		}while(match);
	}
	//Sort the array by number of days remaining
	if(arr.length>1)arr.sort(function(a,b){if(a["diff"]==b["diff"])return(0);else return a["diff"]<b["diff"]?-1:+1;});
	return arr;
};

//Takes the reminder macro parameters and generates the string that is used for display ...not intended to be called by other plugins.
window.getReminderMessageForDisplay= function getReminderMessageForDisplay(diff,params,match,tid){
	var c=config.macros.reminders;
	var anniv="";
	var reminderTitle=params["title"];
	if(reminderTitle==null)reminderTitle=c.untitledReminder;
	if(params["firstyear"]!=null)anniv=c.defaultAnniversaryMessage.replace("DIFF",(match.getFullYear()-params["firstyear"]));
	var sDiff="";
	if(diff==0)sDiff=c.todayString;
	else if(diff==1)sDiff=c.tomorrowString;
	else sDiff=c.ndaysString.replace("DIFF",diff);
	msg=params["format"]!=null?params["format"]:c.defaultReminderMessage;
	msg=msg.replace(/TIDDLER/g,"TIDELER"); //Avoid replacing DD in TIDDLER with the date
	msg=match.formatStringDateOnly(msg);
	msg=msg.replace(/TIDELER/g,"TIDDLER");
	if(tid!=null){
		msg=msg.replace(/TIDDLERNAME/g,tid);
		msg=msg.replace(/TIDDLER/g,"[["+tid+"]]");
	}
	msg=msg.replace("DIFF",sDiff).replace("TITLE",reminderTitle).replace("DATE",match.formatString("mmm. 0DD")).replace("ANNIVERSARY",anniv);
	return msg;
};

// Parse macro params into a hashtable.  This handles the arguments for reminder, showReminders and displayTiddlersWithReminders
window.getParamsForReminder=function getParamsForReminder(params){
	var r={};
	var type="";
	var num=0;
	var title="";
	for(var p=0;p<params.length;p++){
		var split=params[p].split(":");
		type=split[0].toLowerCase();
		var value=split[1];
		for(var i=2;i<split.length;i++)value+=":"+split[i];
		if(type=="nolinks"||type=="limit"||type=="hidden")num=1;
		else if(type=="leadtime"){
			var leads=value.split("...");
			if(leads.length==1){leads[1]=leads[0];leads[0]=0;}
			leads[0]=parseInt(leads[0],10);
			leads[1]=parseInt(leads[1],10);
			num=leads;
		}
		else if(type=="offsetdayofweek"){
			if(value.substr(0,1)=="-"){r["negativeOffsetDayOfWeek"]=1;value=value.substr(1);}
			num=parseInt(value,10);
		}
		else if(type!="title"&&type!="tag"&&type!="format")num=parseInt(value,10);
		else{
			p++;
			title=value;
			while(title.substr(0,1)=='"'&&title.substr(title.length-1,1)!='"'&&params[p]!=undefined)title+= " "+params[p++];
			//Trim off the leading and trailing quotes
			if(title.substr(0,1)=="\""&&title.substr(title.length-1,1)== "\""){
			  title=title.substr(1,title.length-2);
			  p--;
			}
			num=title;
		}
		r[type]=num;
	}
	//date is synonymous with day
	if(r["day"]==null)r["day"]=r["date"];
	return r;
};

//Finds the date specified in the reminder params; returns null if no match found; not intended for use by other plugins
window.findDateForReminder= function findDateForReminder(r,base,LBound,UBound){
	if(base==null)base=new Date().getMidnight();
	var key=base.convertToYYYYMMDDHHMM();
	for(var k in r)key+=","+k+"|"+r[k];
	key+=","+LBound.convertToYYYYMMDDHHMM();
	key+=","+UBound.convertToYYYYMMDDHHMM();
	//If we don't find a match in this run, then cache that the reminder can't be matched
	if(reminderCache[key]==null)reminderCache[key]=false;
	//We've already tried this date and failed
	else if(reminderCache[key]==false)return null;
	else return reminderCache[key];
	var bOffsetSpecified=
		r["offsetyear"]!=null||
		r["offsetmonth"]!=null||
		r["offsetday"]!=null||
		r["offsetdayofweek"]!=null||
		r["recurdays"]!=null;
	// If matching the base date for a dayofweek offset, look for the base date a little further back.
	var tmp1LBound=LBound;
	if(r["offsetdayofweek"]!=null)tmp1LBound=LBound.addDays(-6);
	var match=base.findMatch(r,tmp1LBound,UBound);
	if(match!=null){
		var newMatch=match;
		if(r["recurdays"]!=null)
			while(newMatch.getTime()<LBound.getTime())newMatch=newMatch.addDays(r["recurdays"]);
		else if(
				r["offsetyear"]!=null||
				r["offsetmonth"]!=null||
				r["offsetday"]!=null||
				r["offsetdayofweek"]!=null){
			var tmp=cloneParams(r);
			tmp["year"]=r["offsetyear"];
			tmp["month"]=r["offsetmonth"];
			tmp["day"]=r["offsetday"];
			tmp["dayofweek"]=r["offsetdayofweek"];
			var tmpL=LBound;
			var tmpU=UBound;
			if(tmp["offsetdayofweek"]!=null){
				if(tmp["negativeOffsetDayOfWeek"]==1){
					tmpL=match.addDays(-6);
					tmpU=match;
				}else{
					tmpL=match;
					tmpU=match.addDays(6);
				}
			}
			newMatch=match.findMatch(tmp,tmpL,tmpU);
			//The offset couldn't be matched.  return null.
			if(newMatch==null)return null;
		}
		if(newMatch.isBetween(LBound,UBound)){
		  reminderCache[key]=newMatch;
		  return newMatch;
		}
	}
	return null;
};

//Does the same job as findDateForReminder, but doesn't deal with offsets or recurring reminders.
Date.prototype.findMatch=function findMatch(r,LBound,UBound){
	var Y=(r["year"]!=null);
	var M=(r["month"]!=null);
	var D=(r["day"]!=null);
	var W=(r["dayofweek"]!=null);
	if(D&&M&&Y)return new Date(r["year"],r["month"]-1,r["day"],0,0);
	if(D&&M&&!Y&&!W){
		//Shortcut: first try this year... if too small, try next year
		var tmp=new Date(this.getFullYear(),r["month"]-1,r["day"],0,0);
		if(tmp.getTime()<LBound.getTime())tmp=new Date((this.getFullYear()+1),r["month"]-1,r["day"],0,0);
		if(tmp.isBetween(LBound,UBound))return tmp;
		else return null;
	}
	var newDate=LBound;
	while(newDate.isBetween(LBound,UBound)){
		var test=testDate(newDate,r,Y,M,D,W);
		if(test!=null)return test;
		newDate=newDate.addDays(1);
	}
}

function cloneParams(p){var tmp={};for(var i in p)tmp[i]=p[i];return tmp;}
function testDate(str,d,Y,M,D,W){if((!Y&&d["year"]==str.getFullYear())&&(!M&&(d["month"]-1)==str.getMonth())&&(!D&&d["day"]==str.getDate())&&(!W&&d["dayofweek"]==str.getDay())) return str;}
//Returns true if the date is in between two given dates
Date.prototype.isBetween=function isBetween(lowerBound,upperBound){return(this.getTime()>=lowerBound.getTime()&&this.getTime()<=upperBound.getTime());}
//Return a new date, with the time set to midnight (0000)
Date.prototype.getMidnight=function getMidnight(){return new Date(this.getFullYear(),this.getMonth(),this.getDate(),0,0);}
//Add the specified number of days to a date
Date.prototype.addDays=function addDays(numberOfDays){return new Date(this.getFullYear(),this.getMonth(),this.getDate()+numberOfDays,0,0);}
//Return the number of days between two dates
Date.prototype.getDifferenceInDays=function getDifferenceInDays(d){
	//ignores daylight savings
	var tmp=this.addDays(0);
	if(this.getTime()>d.getTime()){for(var i=0;tmp.getTime()>d.getTime();i++)tmp=tmp.addDays(-1);return i;}
	else{for(var i=0;tmp.getTime()<d.getTime();i++)tmp=tmp.addDays(1);return i*-1;}
	return 0;
}
//Substitute date components into a string
Date.prototype.formatStringDateOnly=function formatStringDateOnly(d){
	d=d.replace("YYYY",this.getFullYear());
	d=d.replace("YY",String.zeroPad(this.getFullYear()-2000,2));
	d=d.replace("MMM",config.messages.dates.months[this.getMonth()]);
	d=d.replace("0MM",String.zeroPad(this.getMonth()+1,2));
	d=d.replace("MM",this.getMonth()+1);
	d=d.replace("DDD",config.messages.dates.days[this.getDay()]);
	d=d.replace("0DD",String.zeroPad(this.getDate(),2));
	d=d.replace("DD",this.getDate());
	return d;
};

//}}}