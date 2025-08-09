version.extensions.counter= {major: 0, minor: 1, revision: 0};
config.macros.counter = {
	handler: function(place) {
var data, p;
var agt=navigator.userAgent.toLowerCase();
p='http';
if((location.href.substr(0,6)=='https:')||(location.href.substr(0,6)=='HTTPS:')) {p='https';} data = '&r=' + escape(document.referrer) + '&n=' + escape(navigator.userAgent) + '&p=' + escape(navigator.userAgent)
if(navigator.userAgent.substring(0,1)>'3') {data = data + '&sd=' + screen.colorDepth + '&sw=' + escape(screen.width+ 'x'+screen.height)};
var link = createTiddlyElement(place,"a",null,null,null);
link.href = "http://www.w3counter.com/stats/4966";
link.target = "_blank";
var img = createTiddlyElement(link,"img",null,null,null);
img.style.border = 0;
img.src = "http://www.w3counter.com/counter.php?i=4966" + data;
}
};
