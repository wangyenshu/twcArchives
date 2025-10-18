version.extensions.smileyMacro = {major: 0, minor: 1, revision: 0, date: new Date(2005,7,20)};
//Author: Alan Hecht
config.macros.smiley = {}
config.macros.smiley.handler = function(place,macroName,params)
{
	var palette = ["transparent","#000000","#1a1507","#352e18","#464646","#666666","#a3141e","#b06b63","#cc9900","#dd9030","#dddddd","#e89d00","#edc32a","#f3cb3c","#fdf201","#fdf526","#ff3149","#ffac00","#ffbf06","#ffc846","#ffcc66","#ffd758","#ffdd01","#ffea7b","#ffed55","#ffffff"];
	var data = params;
	var imageMap = null;
	if(data[0] == ":-)" || data[0] == ":)")

		imageMap = "aaaaabbbbbaaaaaaaabdtyyvtdbaaaaabnyxxxxxujbaaabmyyffyffuujbaadyyyeeyeetttdabppppddyddpmmlbbwoooooooowsrlbbwwpooooowwmrlbbwwboooowwwbllbbwwwboooowbrllbacwwwbbbbbrllcaablswwwwsrrlibaaablsssrrllibaaaaabcrrlllcbaaaaaaaabbbbbaaaaa";
	else if(data[0] == ":-(" || data[0] == ":(")
		imageMap = "aaaaabbbbbaaaaaaaabdtyyvtdbaaaaabnyxxxxxujbaaabmyyyyyyyuujbaadyyyeeyeetttdabppppddyddpmmlbbwoooooooowsrlbbwwpooooowwmrlbbwwoooooowwrllbbwwwwbbbbbsrllbacwwbwwwwsbllcaablswwwwsrrlibaaablsssrrllibaaaaabcrrlllcbaaaaaaaabbbbbaaaaa";
	else if(data[0] == ";-)" || data[0] == ";)")
		imageMap = "aaaaabbbbbaaaaaaaabdtyyvtdbaaaaabnyxxxxxujbaaabmyyxxxxxuujbaadyyyxxxeetttdabppphddyddpmmlbbwoooooooowsrlbbwwpooooowwmrlbbwwboooowwwbllbbwwwboooowbrllbacwwwbbbbbrllcaablswwwwsrrlibaaablsssrrllibaaaaabcrrlllcbaaaaaaaabbbbbaaaaa";
	else if(data[0] == ":-|" || data[0] == ":|")
		imageMap = "aaaaabbbbbaaaaaaaabdtyyvtdbaaaaabnyxxxxxujbaaabmyyffyffuujbaadyyyeeyeetttdabppppddyddpmmlbbwoooooooowsrlbbwwpooooowwmrlbbwwoooooowwrllbbwwwwbbbbbsrllbacwwwwwwwsrllcaablswwwwsrrlibaaablsssrrllibaaaaabcrrlllcbaaaaaaaabbbbbaaaaa";
	else if(data[0] == ":-D" || data[0] == ":D")
		imageMap = "aaaaabbbbbaaaaaaaabdtyyvtdbaaaaabnyxxxxxujbaaabmyyeeyeeuujbaadyyyeeyeetttdabppppyyyyypmmlbbwbbbbbbbbbbblbbwbkzzzzzzzkbwbbwbfzzzzzzzfbwbbwbkzzzzzzzkbwbacwbkzzzzzkblcaablsbkzzzkblibaaablsbbbbblibaaaaabcrrlllcbaaaaaaaabbbbbaaaaa";
	else
		createTiddlyElement(place,"span",null,"errorNoSuchMacro","unknown smiley");
	if(imageMap)
		{
		var box = createTiddlyElement(place,"span",null,"smiley",String.fromCharCode(160));
		box.style.position = "relative";
		box.style.width = "15px";
		box.style.height = "15px";
		box.style.marginLeft = "1px";
		box.style.marginRight = "1px";
		box.style.paddingRight = "12px";
		box.style.verticalAlign = "top";

		//now divide into 15x15 grid and create each pixel
		// rows
		for(r=0; r<15; r++)
			{
			// columns
			for(c=0; c<15; c++)
				{
				//create each pixel with the correct background
				var pix = document.createElement("img");
				pix.className = "smileyPixel";
				pix.style.position = "absolute";
				pix.border = 0;
				pix.style.top = r + "px";
				pix.style.left = c + "px";
				pix.style.width = "1px";
				pix.style.height = "1px";
				pix.style.backgroundColor = palette[imageMap.charCodeAt((r*15)+c)-97];
				pix.src = "data:image/gif,GIF89a%01%00%01%00%91%FF%00%FF%FF%FF%00%00%00%C0%C0%C0%00%00%00!%F9%04%01%00%00%02%00%2C%00%00%00%00%01%00%01%00%40%02%02T%01%00%3B";
				box.appendChild(pix);
				}
			}
		}
}
