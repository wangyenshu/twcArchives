/***
| Name|TwabPlugin|
| Author|Vincent ~DiBartolo ([[vadibart@gmail.com|mailto:vadibart@gmail.com]])|
| Version|2.2|
| Date|12/08/2008|
| Source|http://www.tiddly-twab.com/#TwabPlugin|
| License|BSD License - http://www.tiddly-twab.com/#TheBSDLicense|
| Requires|~TW2.x, [[DataTiddlerPlugin]], [[FormTiddlerPlugin]], [[InlineJavascriptPlugin]], [[PartTiddlerPlugin]], and any Tiddlers with the [[twab]] tag in the source file |
!Description
Elegant system for keeping your Address Book inside a TiddlyWiki document.  Supports import and export of contacts via CSV data.  Built-in support for Google, Yahoo, MSN, and Outlook CSV formats.  Supports customized formats for those not built-in.

!History
* 08-Dec-08, version 2.2 - use company name if neither first name or last name exists on import, allow for multiple contacts with same title
* 21-Jul-08, version 2.1 - use contact's first and last name in email link if it's present (Thanks to Lyall)
* 20-Feb-08, version 2.0 - import and export Google, Yahoo, MSN, Outlook, or custom CSV formats
* 29-Jun-07, version 1.1 - adding support for mailto:, http:, and map directions
* 20-Jun-07, version 1.0 - preparing for release, changed name to twab
* 19-Jun-07, version 0.4 - modified how new contacts are added
* 21-Nov-06, version 0.3 - changed name from ContactParserMacro to AddressBookMacro
* 10-Oct-06, version 0.2 - converted from regex parsing for title of contact Tiddler to JSON
* 09-Oct-06, version 0.1 - created file

!Example of Adding New Contact
Place the following code in any Tiddler:
{{{
<<twab>>
}}}
Which will result in: <<twab>>
You can add extra parameters to change the button's name as in:
{{{
<<twab press this button>>
}}}
Which will result in: <<twab press this button>>
See [[About:twab:Overview]] for more information.

!Example of Import
Place the following code in any Tiddler:
{{{
<<twab Import AddressBook>>
}}}
Which will result in: <<twab Import AddressBook>>
See [[About:twab:Import]] for more information.

!Example of Export
Place the following code in any Tiddler:
{{{
<<twab Export AddressBook>>
}}}
Which will result in: <<twab Export AddressBook>>
See [[About:twab:Export]] for more information.

! Generate Test Data for Import
Place the following code in any Tiddler:
{{{
<<twab ImportTest>>
}}}
Which will result in: <<twab ImportTest>>
See [[About:twab:Import]] for more information.

!Code
***/
//{{{


version.extensions.TwabMacro = { 
   major: 2, 
   minor: 0, 
   revision: 0, 
   date: new Date(2008,02,16), 
   source: "http://www.tiddly-twab.com"
};


config.macros.twab = {};
config.macros.twab.newButtonText    = "new contact";
config.macros.twab.importButtonText = "import contacts";
config.macros.twab.exportButtonText = "export contacts";
config.macros.twab.preClean         = true;
config.macros.twab.importTiddler    = "TwabImport";
config.macros.twab.exportTiddler    = "TwabExport";
config.macros.twab.importTags       = "AddressBook";
config.macros.twab.exportTags       = "AddressBook";
config.macros.twab.fnameField       = "first.name";
config.macros.twab.lnameField       = "last.name";
config.macros.twab.companyNameField = "company";
config.macros.twab.mapTagPrefix     = "format:";
config.macros.twab.skipFlag         = "<skip>";
config.macros.twab.unmappedFlag     = "unmapped";


config.macros.twab.handler = function (place, macroName, params) {

   if( (params.length == 1) && (params[0] == "ImportTest") ){

      //if they want to create an import test button
      createTiddlyButton(place, "Populate " + config.macros.twab.importTiddler, "", this.testImport);
      return;

   } else if( (params.length >= 1) && (params[0] == "Import") ){

      //any other params are interpreted as tags to be placed on imported tiddlers
      if( params.length >= 2 ){
         config.macros.twab.importTags = "";
         for( var i=1; i<params.length; i++){
            config.macros.twab.importTags += params[i] + " ";
         }//for

      }//if

      //if they want to import data
      createTiddlyButton(place, config.macros.twab.importButtonText, "", this.importContacts);

   } else if( (params.length >= 1) && (params[0] == "Export") ){

      //the first tag of the remainder is the one to use for exports
      if( params.length >= 2 ){
         config.macros.twab.exportTags = params[1];
      }//if

      //if they want to export data
      createTiddlyButton(place, config.macros.twab.exportButtonText, "", this.exportContacts);

   } else {
   
      //assume want to create a new contact - any extra params are button name
      var buttonText = "";
      for( var i=0; i<params.length; i++){
         buttonText += " " + params[i] + " ";
      }//for

      createTiddlyButton(place, ((buttonText == "") ? config.macros.twab.newButtonText : buttonText), "", this.newContact);

   }//if-else ifs

}//function handler



//from: http://www.nicknettleton.com/zine/javascript/trim-a-string-in-javascript
config.macros.twab.trim = function(word) { return word.replace(/^\s+|\s+$/g, ''); }



//proxy that retrieves some data and sets null to empty string
config.macros.twab.getData = function(tiddlerName, fieldName){

   var data = DataTiddler.getData(tiddlerName, fieldName);

   if( data == null ){
      data = "";
   }//if

   return data;

}//function getData



config.macros.twab.testImport = function(e){

   var title = config.macros.twab.importTiddler;

   var text = "first.name,last.name,job.title,webpage,phone,email\nPrincess,Leia,\"Leader, Rebels\",http://starwars.wikia.com/wiki/Leia_Organa,,leia@alderaan.com\nDarth,Vader,\"Sith Lord\",http://starwars.wikia.com/wiki/Darth_Vader,555-1212,darth@deathstar.com\nLuke,Skywalker,Jedi Master,http://starwars.wikia.com/wiki/Luke_Skywalker,,luke@tatooine.com";

   store.saveTiddler(title, title, text, config.options.txtUserName);
   story.displayTiddler(null, title, DEFAULT_VIEW_TEMPLATE);
   return true;

}//function import



config.macros.twab.newContact = function(e){

   var title = prompt("Please enter contact's name", "");
   if( (title == null) || (title == "") ){
      return;
   }//if

   store.saveTiddler(title, title, "<<tiddler ContactsFormTemplate>><data>{}</data>", config.options.txtUserName, new Date(), config.macros.twab.importTags);

   story.displayTiddler(null, title, DEFAULT_VIEW_TEMPLATE);

}//function new



config.macros.twab.importContacts = function(e){
   config.macros.twab.deleteAll();
   config.macros.twab.parseAll( config.macros.twab.getImportedCSVText() );
   alert("Contacts successfully imported.");
   return true;
}//function importContacts



config.macros.twab.exportContacts = function(e){
   var title   = config.macros.twab.exportTiddler;
   var mapping = config.macros.twab.getMapping(title, true);
   store.saveTiddler(title, title, config.macros.twab.getExportedCSVText(mapping), config.options.txtUserName );
   story.displayTiddler(null, title, DEFAULT_VIEW_TEMPLATE);
   return true;
}//function exportContacts



config.macros.twab.deleteAll = function(){

   if( !config.macros.twab.preClean ){
      return;
   }//if

   //only remove tiddlers tagged with only first tag if contacts each get more than one
   var tags = config.macros.twab.importTags.split(" ");
   var tag  = tags[0];
   if( !confirm("Are you sure you want to clear existing Tiddlers tagged \"" + tag + "\"?") ){
      return;
   }//if

   var contacts = store.getTaggedTiddlers(tag);
   for( var i=0; i<contacts.length; i++ ){
      store.removeTiddler( contacts[i].title );
   }//for

}//function deleteAll



config.macros.twab.getImportedCSVText = function(){
   return store.getTiddler(config.macros.twab.importTiddler).text;
}//function getImportedCSVText



config.macros.twab.getExportedCSVText = function(mapping){

   var returnStr = "";

   //get the mapped header columns
   for( var i=0; i<mapping.length; i++ ){

      if( mapping[i] && (mapping[i] != config.macros.twab.unmappedFlag) ){
         var twabCol = mapping[i];
         var mapCol  = mapping[twabCol];
         returnStr  += '"' + mapCol + '",';
      }//if

   }//for

   //get the unmapped header columns
   var unmappedStr = mapping[config.macros.twab.unmappedFlag];
   if( unmappedStr ){

      var unmappedArr = unmappedStr.split(",");
      for( var i=0; i<unmappedArr.length; i++ ){
         returnStr += '"' + unmappedArr[i] + '",';
      }//for

      //strip off the last ","
      returnStr = returnStr.substring(0, returnStr.length-1);

   }//if

   returnStr += "\n";

   //get all contacts
   var tags     = config.macros.twab.exportTags.split(" ");
   var contacts = store.getTaggedTiddlers( tags[0] );
   for( var i=0; i<contacts.length; i++ ){
      returnStr += config.macros.twab.exportContact(contacts[i], mapping) + "\n";
   }//for

   return returnStr;

}//function getExportedCSVText



config.macros.twab.parseAll = function (contactStr){

   var rows = contactStr.split("\n");
   if( rows.length < 2 ){
      alert("Two or more rows must be present to parse contacts.");
      return;
   }//if

   var header = config.macros.twab.parseHeader(rows[0]);
   if( header.length == 0 ){
      return;
   }//if

   var contacts = new Array();
   for( i=1; i<rows.length; i++){
      contacts[ i-1 ] = config.macros.twab.parseContact(header, rows[i]);
   }//for

   //uncomment this to get contact-by-contact alerts
   //config.macros.twab.debugAll(contacts);
   config.macros.twab.addAll(contacts);

}//function parseAll



config.macros.twab.parseHeader = function(row){

   var mappedHeader = new Array();

   //get the raw data
   var unmappedHeader = config.macros.twab.parseCSV(row);

   //get the appropriate mapping
   var mapping = config.macros.twab.getMapping(config.macros.twab.importTiddler, false);

   //now convert the unmapped header to the mapped header
   for( var i=0; i<unmappedHeader.length; i++ ){

      var colName = unmappedHeader[i].replace(/ /g, ".").toLowerCase();
      if( mapping[colName] ){
         mappedHeader[i] = mapping[colName];
      } else {
         mappedHeader[i] = config.macros.twab.skipFlag;
      }//if

      //uncomment this to get field-by-field alerts from the header
      //alert("Header field " + i + " is '" + mappedHeader[i] + "'");

   }//for

   return mappedHeader;

}//function parseHeader



config.macros.twab.getMapping = function(tiddlerName, isExport){

   var mapTiddlerName = "";
   if( store.getTiddler(tiddlerName) ){

      //see if they've declared a mapping (preset or custom) by looking
      //at a tag on the tiddler passed in
      var tagStr = ""+store.getTiddler(tiddlerName).tags; 
      var tags   = tagStr.split(',');
   
      for( var i=0; i<tags.length; i++ ){
   
         if( tags[i].indexOf( config.macros.twab.mapTagPrefix ) == 0 ){
            mapTiddlerName = tags[i].replace(config.macros.twab.mapTagPrefix, "");
         }//if
   
      }//for
         
   }//if

   //parse the mapping Tiddler
   var mapTiddler = config.macros.twab.getMappingTiddler(mapTiddlerName);
   if( !mapTiddler ){
      alert("Import/Export Format Tiddler " + mapTiddler + " does not exist.  Can't proceed.");
      return new Array();
   }//if

   var mapText = ""+store.getTiddler(mapTiddler).text;
   var mapArr  = mapText.split("\n");

   var mapping = new Array();
   for( var i=0; i<mapArr.length; i++ ){

      var rule = mapArr[i].split("=");
      if( !rule || (rule.length < 2) ){
         continue;
      }//if

      //uncomment this to see what mapping is being applied to your import file
      //alert("Twab column '" + twabCol + "' is mapped to input tiddler column '" + mapCol + "'");

      if( isExport ){

         var twabCol = config.macros.twab.trim( rule[0] );
         var mapCol  = config.macros.twab.trim( rule[1] );
         if( mapCol == config.macros.twab.skipFlag ){
            continue;
         }//inner if

         mapping[twabCol] = mapCol;
         mapping[i]       = twabCol;

      } else {

         var twabCol = config.macros.twab.trim( rule[0].replace(/ /g, ".").toLowerCase() );
         var mapCol  = config.macros.twab.trim( rule[1].replace(/ /g, ".").toLowerCase() );
         mapping[mapCol] = twabCol;
         mapping[i]      = mapCol;

      }//outer if-else

   }//for 

   return mapping;

}//function getMapping



config.macros.twab.getMappingTiddler = function(name){

   var tiddlerName = "TwabDefaultFieldMap";

   if( name == "google" ){
      tiddlerName = "TwabGoogleFieldMap";

   } else if( name == "yahoo" ){
      tiddlerName = "TwabYahooFieldMap";

   } else if( name == "msn" ){
      tiddlerName = "TwabMSNFieldMap";

   } else if( name == "outlook" ){
      tiddlerName = "TwabOutlookFieldMap";

   } else {

      //see if a Tiddler by this name exists, if not use the default
      if( (name != "default") && store.getTiddler(name) ){
         tiddlerName = name;
      } else {
         tiddlerName = "TwabDefaultFieldMap";
      }//inner if-else

   }//outer if-else ifs

   return tiddlerName;

}//function getMappingTiddler



config.macros.twab.parseCSV = function(row){

   var scrubbed = new Array();
   var fields   = row.split(",");
   for( var i=0; i<fields.length; i++){

      //if starts with quote but doesn't end with a quote, likely had a comma in the middle
      if( (fields[i].charAt(0) == '"') && (fields[i].charAt( fields[i].length-1) != '"') ){

         //Hotmail bug: last contact doesn't have ending double-quote
         if( i == (fields.length-1) ){
            scrubbed[ scrubbed.length ] = fields[i].replace(/"/g, "");
            continue;
         }//if

         var quoted = fields[i++];
         if( !fields[i] ){
            continue;
         }//if

         while( fields[i].charAt( fields[i].length-1 ) != '"' ){
            quoted += "," + fields[i++];
         }//while

         quoted += "," + fields[i];
         scrubbed[ scrubbed.length ] = quoted.replace(/"/g, "");

      } else {
         scrubbed[ scrubbed.length ] = fields[i].replace(/"/g, "");

      }//if-else

   }//for

   return scrubbed;

}//function parseCSV



config.macros.twab.parseContact = function (header, row){

   var returnStr = "";
   var fields    = config.macros.twab.parseCSV(row);
   for( var i=0; i<fields.length; i++ ){

      if( header[i] == config.macros.twab.skipFlag ){
         continue;

      } else if( fields[i] ){
         returnStr += "\"" + header[i] + "\":\"" + fields[i] + "\",";

      }//if-else

   }//for

   return returnStr.substr(0, returnStr.length-1);

}//function parseContact



//export a particular contact to a particular mapping
config.macros.twab.exportContact = function(contactTiddler, mapping){

   var returnStr = "";
   var text      = contactTiddler.text;

   //have to strip out FormTiddler stuff
   text = text.replace(/<<tiddler ContactsFormTemplate>>/g, "");
   text = text.replace(/<data>/g, "");
   text = text.replace(/<\/data>/g, "");
   text = text.replace(/\n/g, "");

   //use JSON format to our advantage
   var contact = eval( "("+text+")" ); 

   for( var i=0; i<mapping.length; i++){

      var twabCol = mapping[i];
      if( !(twabCol) || 
          !(mapping[twabCol]) || 
          (twabCol == config.macros.twab.unmappedFlag) || 
          (mapping[twabCol] == config.macros.twab.skipFlag)){
         continue;
      }//if

      //Google hack - on export, "Name" should be "first.name" and "last.name" together.
      //Know this because "first.name" is mapped to "Name" and "last.name" is not mapped
      if( (twabCol == config.macros.twab.fnameField) && !mapping[config.macros.twab.lnameField] ){
         returnStr += '"' + contact[config.macros.twab.fnameField] + " " + contact[config.macros.twab.lnameField] + '",'
      } else if( contact[twabCol] ){
         returnStr += '"' + contact[twabCol] + '",';
      } else {
         returnStr += ",";
      }//if-else

   }//for

   //get the unmapped columns
   var unmappedStr = mapping[config.macros.twab.unmappedFlag];
   if( unmappedStr ){

      var unmappedArr = unmappedStr.split(",");
      for( var i=0; i<unmappedArr.length; i++ ){
         returnStr += ",";
      }//for

      //strip out the last ","
      returnStr = returnStr.substr(0, returnStr.length-1);

   }//if

   return returnStr.replace(/\n/g, "");

}//function exportContact



//add/overwrite existing contacts with the data parsed out of the import tiddler
config.macros.twab.addAll = function(contacts){

   for( var i=0; i<contacts.length; i++ ){

      if( !contacts[i] ){
         continue;
      }//if

      //use JSON format to our advantage
      var toEval  = "({" + contacts[i] + "})";  
      var contact = eval(toEval); 
      var title   = config.macros.twab.getSaveTitle(contact);
      if( title == "" ){
         continue;
      }//if

      //add it now
      var text = config.macros.twab.toTiddlyFormat(contacts[i]);
      store.saveTiddler(title, title, text, config.options.txtUserName, new Date(), config.macros.twab.importTags);

   }//for

}//function addAll



config.macros.twab.getSaveTitle = function(contact){

   var title = "";

   if( contact[config.macros.twab.fnameField] ){
      title += contact[config.macros.twab.fnameField];
   }//if

   if( contact[config.macros.twab.lnameField] ){
      title += contact[config.macros.twab.lnameField];
   }//if

   if( title == "" ){
      title = contact[config.macros.twab.companyNameField];
   }//if

   if( title == "" ){
      alert("Contact missing name field - could not be added: \n" + contacts[i]);
      return "";
   }//if

   if( store.tiddlerExists(title) ){

      //try up to 50 times
      var seqTitle = "";
      var foundOne = false;
      for( var i=2; i<51; i++){

         seqTitle = title + " (" + i + ")";
         if( !store.tiddlerExists(seqTitle) ){
            title    = seqTitle;
            foundOne = true;
            break;
         }//innermost if

      }//inner if

      //if got to 50 then there's a problem
      if( !foundOne ){
         alert("Seriously, you really have that many contacts named '" + title + "'?  Wow.");
         return "";
      }//if

   }//if

   return title;

}//function getSaveTitle



config.macros.twab.toTiddlyFormat = function(contact){

   var tpl = config.macros.twab.getContactTemplate();
   return tpl.replace( config.macros.twab.getMacroName(), contact);

}//function toTiddlyFormat



config.macros.twab.getContactTemplate = function(){
   var macroName = config.macros.twab.getMacroName();
   return "<<tiddler ContactsFormTemplate>>\n<data>{" + macroName + "}</data>";
}//function getContactTemplate



config.macros.twab.getMacroName = function(){
   return "#thisContact#";
}//function getMacroName



config.macros.twab.debugAll = function(contacts){

   for( var i=0; i<contacts.length; i++ ){
      //alert( contacts[i] );
      alert( config.macros.twab.toTiddlyFormat(contacts[i]) );
   }//for

}//function debugAll



config.macros.twab.populateLinks = function(place){
   config.macros.twab.populateEmail(place, "email");
   config.macros.twab.populateEmail(place, "other.email");
   config.macros.twab.populateEmail(place, "business.email");
   config.macros.twab.populateHref(place, "webpage");
   config.macros.twab.populateMap(place, "home");
   config.macros.twab.populateHref(place, "business.webpage");
   config.macros.twab.populateMap(place, "business");
}//function populateLinks



config.macros.twab.populateEmail = function(place, fieldName){
   var tiddlerName = config.macros.formTiddler.getContainingTiddlerName(place);
   var element     = document.getElementById("twab." + fieldName);
   if( element ){
      element.innerHTML = config.macros.twab.formatEmail(tiddlerName, fieldName);
   }//if
}//function populateEmail



//Thanks to Udo for the idea for this solution and to Lyall for the code to use display name
config.macros.twab.formatEmail = function(tiddlerName, fieldName){

   var returnStr   = "";
   var mailTo      = config.macros.twab.getData(tiddlerName, fieldName);
   var displayName = config.macros.twab.getData(tiddlerName, "first.name") + " " + config.macros.twab.getData(tiddlerName, "last.name");

   if( mailTo != "" ){

      if( displayName != "" ){
         mailTo = displayName + "<" + mailTo + ">";
      }//if

      returnStr = "<a href=\"mailto:" + mailTo + "\" content=\"\">(email)</a>";

   }//if

   return returnStr;

}//function formatEmail



config.macros.twab.populateHref = function(place, fieldName){
   var tiddlerName = config.macros.formTiddler.getContainingTiddlerName(place);
   var element = document.getElementById("twab." + fieldName);
   if( element ){
      element.innerHTML = config.macros.twab.formatHref(tiddlerName, fieldName);
   }//if
}//function populateHref



//Thanks to Udo for the idea for this solution
config.macros.twab.formatHref = function(tiddlerName, fieldName){

   var returnStr = "";
   var href     = config.macros.twab.getData(tiddlerName, fieldName);

   if( href != "" ){

      if( href.indexOf("http") != 0 ){
         href = "http://" + href;
      }//inner if

      returnStr = "<a href=\"" + href + "\" content=\"\" target=\"twab\">(visit)</a>";

   }//if

   return returnStr;

}//function formatHref



config.macros.twab.populateMap = function(place, fieldType){
   var tiddlerName = config.macros.formTiddler.getContainingTiddlerName(place);
   var element = document.getElementById("twab." + fieldType + ".map");
   if( element ){
      element.innerHTML = config.macros.twab.formatMap(tiddlerName, fieldType);
   }//if
}//function populateHref



//Thanks to Udo for the idea for this solution
config.macros.twab.formatMap = function(tiddlerName, fieldType){

   //hack for lack of planning of home versus business labels
   if( fieldType == "business"){
      fieldType += ".";
   } else if( fieldType == "home" ){
      fieldType = "";
   }//if-else if

   var returnStr = "";

   var address = "";
   if( DataTiddler.getData(tiddlerName, fieldType+"address") ){
      address += DataTiddler.getData(tiddlerName, fieldType+"address") + " ";
   }//if

   if( DataTiddler.getData(tiddlerName, fieldType+"city") ){
      address += DataTiddler.getData(tiddlerName, fieldType+"city") + " ";
   }//if

   if( DataTiddler.getData(tiddlerName, fieldType+"state") ){
      address += DataTiddler.getData(tiddlerName, fieldType+"state") + " ";
   }//if

   if( DataTiddler.getData(tiddlerName, fieldType+"postal") ){
      address += DataTiddler.getData(tiddlerName, fieldType+"postal") + " ";
   }//if

   if( address == "" ){
      return "";
   }//if

   var href  = "http://maps.google.com/maps?ie=UTF8&hl=en&q=" + address + "&f=q&sampleq=1";
   returnStr = "<a href=\"" + href + "\" content=\"\" target=\"twab\">(map)</a>";

   returnStr.replace(/ /g, "\+");
   return returnStr;

}//function formatMap

//}}}

