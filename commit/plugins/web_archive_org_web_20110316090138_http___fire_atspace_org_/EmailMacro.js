version.extensions.email = {major: 0, minor: 1, revision: 0};
config.macros.email = {};
config.macros.email.handler = function(place,mname,params) {
 var text = params.length > 2? params[2]:"send mail";
 var link = createTiddlyElement(place,"a",null,null,text);
 link.href = "mailto:" + params[0] + "@" + params[1];
}
