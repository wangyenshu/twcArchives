/***
|''Name:''|DC3.Ajax|
|''Description:''|General purpose Ajax class|
|''Date:''|Oct 10, 2006|
|''Source:''|http://solo.dc3.com/tw/index.html#DC3.Ajax|
|''Author:''|Bob Denny ~DC-3 Dreams, SP|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''Version:''|1.0.5|
|''~CoreVersion:''|2.0.11, 2.1.0|
|''Browser:''|Firefox 1.5; Internet Explorer 6.0; Safari|
|''Require:''|//none//|
!!Description
Ajax library
!!Usage
TBD
!!Revision History
<<<
''2006.09.16 [1.0.1]'' Initial creation, loosely patterned after BidiX Ajax
''2006.09.20 [1.0.2]'' Add POST to core, refactor massively, now object can contain multiple methods. Add postForm() method.
''2006.09.22 [1.0.3]'' Support posting hidden fields in postForm()
''2006.09.26 [1.0.4]'' Change error reporting to popups. Include status code, status text and any body text in error popup.
''2006.10.03 [1.0.5]'' Refactor post code, lowercase element type strings for tests, check out on TW 2.1.0
<<<
!!Code
***/
//{{{
if (!window.DC3) window.DC3 = {};
DC3.Ajax = 
{
	sendRequest: function(method, url, postData, onComplete, clientParams)
	{
		var xmlhttp;
	    
		try { 
			xmlhttp = new XMLHttpRequest(); 
		} catch (e) {
			try { 
				xmlhttp = new ActiveXObject("Msxml2.XMLHTTP"); 
			} catch (e) {
				try { 
					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
				} catch (e) { 
					alert(e.description?e.description:e.toString()); 
				}
			}
		}
		if (!xmlhttp) {
			alert("Can't support AJAX: Update your browser!");
			return;
		}
		if (window.netscape) {
			try {
				if (document.location.protocol.indexOf("http") == -1) {
					netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
				}
			} catch (e) { 
				alert(e.description ? e.description : e.toString()); 
			}
		}
	    
		xmlhttp.onreadystatechange = function ()						// Completion event
		{
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200 || xmlhttp.status === 0) {
					onComplete(xmlhttp.responseText, clientParams);
				} else {
					alert(xmlhttp.status + " " + xmlhttp.statusText + ":\n" + xmlhttp.responseText);
				}
			}
		};
	    
		try {
			xmlhttp.open(method, url, true);
			if(method.toLowerCase() == 'post') {
				xmlhttp.setRequestHeader("Content-Type",
					"application/x-www-form-urlencoded");
				xmlhttp.send(postData);
			} else if (config.browser.isIE) {	// Pathetic!
				xmlhttp.send(); 
			} else { 
				xmlhttp.send(null); 
			}
		} catch (e) { 
			alert(url + "failed: " + e.toString()); 
		}
	},
    
	postForm: function(form, url, onComplete, clientParams)
	{
		var encode = function(name, val, last) {
			return encodeURIComponent(name) + "=" + encodeURIComponent(val) + (last ? "" : "&");
		};
		var nElem = form.elements.length;
		var fData = "";
		// Must hand-construct query string according to rules
		for(var i = 0; i < nElem; i++) {
			var elem = form.elements[i];
			var last = (i == nElem - 1);
			switch(elem.type.toLowerCase()) {
				case "text":
				case "password":
				case "textarea":
				case "select-one":
				case "hidden":
					fData += encode(elem.name, elem.value, last);		// Encode even if empty
					break;
				case "checkbox":
				case "radio":
					if(elem.checked)
						fData += encode(elem.name, elem.value, last);
					break;
				case "select-multiple":
					for(var j = 0; j < elem.options.length; j++) {
						if(elem.options[j].selected)					// Encode only selected (may be none!)
							fData += encode(elem.name, elem.options[j].value);
					}
					break;
				default:										// Others unsupported 
					displayMessage("Ajax.postForm: " + elem.type + " form elements not supported.");
					return; 									// BAIL OUT!
			}
		}
		this.sendRequest("POST", url, fData, onComplete, clientParams);
	}
};
//}}}
 
