//{{{
config.options.txtFadeTimer = 5000; // 5 seconds 

var displayMessageFADEOUT=displayMessage;
displayMessage=function(text,linkText)
{
	displayMessageFADEOUT.apply(this, arguments);
	ti=config.options.txtFadeTimer;
	if(ti>0)setTimeout(clearMessage,ti); 
}
//}}}