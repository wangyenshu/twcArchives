/***
|''Name:''|ToggleSideBarTB|
|''Description''|allows to toggle left and right sidebar|
|''Version:''|1.1|
|''Type''|macro|
|''Author:''|[[TobiasBeer]]|
|''Info:''|http://tbgtd.tiddlyspot.com/#ToggleSideBarTB|
|''Source:''|http://tbgtd.tiddlyspot.com/#ToggleSideBarTB|
|''License''|[[Creative Commons Attribution-Share Alike 3.0|http://creativecommons.org/licenses/by-sa/3.0/]]|
|''~CoreVersion''|2.xx|
!Code
***/
//{{{
config.macros.toggleSideBarTB={
  settings:{
    arr1:"►",arr2:"◄",
    lblToggle:"toggle %0",
    leftBarID:"mainMenu",leftBarLbl:"main menu",
    leftBarHide:"margin-left:2em;",leftBarShow:"margin-left:2em;",
    rightBarID:"sidebarTabs",rightBarLbl:"sidebar",
    rightBarHide:"margin-right:2em;",rightBarShow:"margin-right:24em;"
  },
  handler:function(place,macroName,params,wikifier,paramString,tiddler){
    var l=params[0]&&params[0]=="left";
    var h=params[1]&&params[1]=="hide";
    var no=params[2]&&params[2]=="notip";
    var s=this.settings;
    var el=l?s.leftBarID:s.rightBarID;
    var btnId="ToggleSideBar"+(l?"Left":"Right");
    var arr=l?(h?s.arr1:s.arr2):(h?s.arr2:s.arr1);
    var lbl=(no?'':s.lblToggle.format([(l?s.leftBarLbl:s.rightBarLbl)]));
    var fct=function(){config.macros.toggleSideBarTB.toggle(btnId)};
    document.getElementById(el).setAttribute("toggle","hide");
    createTiddlyButton(place,arr,lbl,fct,"button HideSideBarButton",btnId);
    if(h)config.macros.toggleSideBarTB.toggle(btnId);
  },
  toggle:function(btnId){
    var btn=document.getElementById(btnId);
    var l=btn.id=="ToggleSideBarLeft";
    var s=config.macros.toggleSideBarTB.settings;
    var bl=document.getElementById(s.leftBarID);
    var br=document.getElementById(s.rightBarID);
    var bar=(l?bl:br);
    var hl=bl.getAttribute("toggle")=='show';if(l)hl=!hl;
    var hr=br.getAttribute("toggle")=='show';if(!l)hr=!hr;
    var h=(l?hl:hr);
    setStylesheet("#tiddlerDisplay, #searchResults {"+
        (hl?s.leftBarHide:s.leftBarShow)+
        (hr?s.rightBarHide:s.rightBarShow)+
      "}","ToggleSideBarStyles");
    bar.style.display=h?"none":"block";
    bar.setAttribute("toggle",(h?"show":"hide"));
    arr1=l?s.arr2:s.arr1;arr2=l?s.arr1:s.arr2;
    btn.innerHTML=h?arr2:arr1;
  }
}
//}}}