/***
|''Name''|TiddlyChartsPlugin|
|''Description''|Translates tables to bar charts, pie charts and line charts|
|''Author''|Jon Robson|
|''Version''|0.6.10|
|''Source''||
|''License''|[[BSD|http://www.opensource.org/licenses/bsd-license.php]]|
|''Requires''|g.pie.js|
!Usage
{{{
<<PieChart TiddlerTitle>>
<<BarChart TiddlerTitle>>
<<LineChart TiddlerTitle>>
Where TiddlerTitle is a tiddler with an html table in it (which can be produced by wiki markup)
Note x values can now be date strings recognised by JavaScript's date formatter "MM/DD/YYYY HH:MM:SS" for example or in the format "YYYYMMDDHHMM"
}}}
!Parameters
dataView:col
read vertically - headings are the first column
dataView:row
read horizontally - headings are the first row
width:400 height:400
set width and height
!Code
***/
//{{{
(function($) {
	
var macro = config.macros.Chart = {
	handler: function() {
		//not yet
	},
	getData: function(title,options){
		if(options && options.dataView && options.dataView == "col") {
			return macro.getDataColumns(title);
		} else {
			return macro.getDataRows(title);		
		}
	},
	getDataRows: function(title) {
		var data = store.getTiddlerText(title);
		if(!data) {
			throw "There is no tiddler called %0 so unable to access rows.".format([title]);
		}
		var temp =$("<div />")[0];
		wikify(data, temp);
		var rows = $("tr", temp);
		return rows;
	},
	getDataColumns: function(title) {
		var data = store.getTiddlerText(title);
		if(!data) {
			throw "There is no tiddler called %0 so unable to access columns.".format([title]);
		}
		var temp =$("<div />")[0];
		wikify(data, temp);
		var rows = $("tr", temp);
		var columns = [];
		$(rows).each(function(i, rowEl) {
			var columnEls = $("td", rowEl);
			$(columnEls).each(function(j, colEl) {
				if(!columns[j]) {
					var parent = document.createElement("tr");
					columns.push(parent);
				}
				columns[j].appendChild(colEl)
			});
		});
		return $(columns);
	},
	getOptions: function(paramString) {
		var userParams = paramString.parseParams("anon",null,true,false,false)[0];
		var defaults = {
			axis: "0 0 1 1",
			legendpos: "east",
			nostroke: false,
			smooth: true,
			symbol: "x",
			width: 320,
			height: 240,
			barEdges: "smooth",
			dataView: "row",
			dateString: "0DD/0MM/YYYY"
		};
		var options = merge({}, defaults);
		for(var i in userParams) {
			var val = userParams[i][0];
			if(val == "no") {
				val = false;
			}
			options[i] = val;
		}
		if(userParams.smooth && userParams.smooth[0]) {
			barEdges = "smooth";
		}
		options.params = userParams.anon;
		return options;
	},
	createCanvas: function(place, options) {
		var container = $('<div class="chart" />').appendTo(place)[0];
		var r = Raphael(container, options.width, options.height);
		return r;
	}
};
var pieMacro = config.macros.PieChart = {
	handler: function(place,macroName,params,wikifier,paramString,tiddler) {
		var options = macro.getOptions(paramString);
		var data = pieMacro.getData(params[0], options);
		var r = macro.createCanvas(place, options);
		var halfWidth = options.width/2;
		var halfHeight = options.height/2;
		var radius = halfWidth > halfHeight ? halfHeight : halfWidth;
		radius -= 50;
		var pie = r.g.piechart(halfWidth - 50, halfHeight -50, radius, data.values, {legend: data.legend, legendpos: options.legendpos});
		pie.hover(function () {
			this.sector.stop();
			this.sector.scale(1.1, 1.1, this.cx, this.cy);
			if (this.label) {
			 this.label[0].stop();
			 this.label[0].scale(1.5);
			 this.label[1].attr({"font-weight": 800});
			}
		}, function () {
			this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500, "bounce");
			if (this.label) {
				this.label[0].animate({scale: 1}, 500, "bounce");
				this.label[1].attr({"font-weight": 400});
			}
		});
	},
	getData: function(title, options) {
		var rows = macro.getData(title, options);
		if(rows.length > 2) {
			throw "Unknown table of data: Looking for 2 rows/columns. Try dataView:col parameter";
		}
		var headingRow = rows[0]; 
		var dataRow = rows[1];
		var values = [], headings = [];
		$("td", $(headingRow)).each(function(i, el) {
			headings.push($(el).text());
		});

		$("td", dataRow).each(function(i, el) {
				values.push(parseFloat($(el).text()));
		});
		if(isNaN(values[0])) {
			headings = headings.splice(1, headings.length);
			values = values.splice(1, values.length);
		}
		return {values: values, legend: headings};
	}
};

var lineMacro = config.macros.LineChart = {
	handler: function(place,macroName,params,wikifier,paramString,tiddler) {
		var container = $("<div />").attr("macroName", macroName).attr("refresh", "macro").
			attr("paramString", paramString).appendTo(place);
		lineMacro.refresh(container);
	},
	refresh: function(place) {
		$(place).empty();
		var paramString = $(place).attr("paramString");
		var options = macro.getOptions(paramString);
		var params = options.params;
		var r = macro.createCanvas(place, options);
		var data = lineMacro.getData(params[0], options);
		var chart = r.g.linechart(50, 50, options.width - 50, options.height - 100, 
			data.xValues, data.yValues, {nostroke: options.nostroke, axis: options.axis, symbol: options.symbol, smooth: options.smooth});
		var newItems = [];
		if(data.mapX) {
			$.each(chart.axis[0].text.items, function(i, label) {
				var old = label.attr("text");
				if(old) {
					var newLabel = data.mapX(old);
					if(newLabel) {
						label.attr({ text: newLabel });
					}
				}
			});
		}
		
		if(options.symbol) {
			chart.hoverColumn(
				function () {
					this.tags = r.set();
					for (var i = 0, ii = this.y.length; i < ii; i++) {
						this.tags.push(r.g.tag(this.x, this.y[i], this.values[i], 160, 10).insertBefore(this).attr([{fill: "#fff"}, {fill: this.symbols[i].attr("fill")}]));
					}
				}, 
				function () {
					this.tags && this.tags.remove();
				}
			);
		}
	},
	getData: function(title, options) {
		var rows = macro.getData(title, options);
		var rowsData = [];
		var headings = [];
		var xValues = [];
		var xOrigin;
		var mapX = function(x) {
			if(options.mode === "date") {
				var d = new Date(xOrigin.getTime() + x);
				d = d.formatString(options.dateString);
				return d;
			}
			return x;
		};
		$(rows).each(function(i, el) {
			$("td", el).each(function(j, col) {
				var val = $(col).text();
				if(i == 0) { // first row contains headings
					headings.push(val);
				} else if(j == 0) { // x value
					val = val.trim();
					var isNumber = val.match("[0-9\.]*")[0].length == val.length;
					var x = parseFloat(val, 10);
					var asDate = new Date.convertFromYYYYMMDDHHMM(val);
					if(val.indexOf("/") == 2) { // assume its a date in YYYY/MM/DD HH:MM:SS format
						if(i == 1) { // first date encountered
							// turn it into a date.
							xOrigin = new Date(val);
							x = 0;
						} else {
							// turn it into a date
							thisdate = new Date(val);
							var timePassed = thisdate - xOrigin;
							x = timePassed;
						}
					} else if(!isNaN(asDate)) {
						options.mode = "date";
						if(i == 1) {
							xOrigin = asDate;
							x = 0;
						} else {
							x = asDate - xOrigin;
						}
					} else if(isNaN(x) || !isNumber) { // make it an iterable
						x = i -1;
					} else {
						x = x;
					}
					xValues.push(x);
				} else { // have a y value
					if(!rowsData[j-1]) {
						rowsData.push([]);
					}
					var y = parseFloat(val);
					if(isNaN(y)) {
						throw "invalid y value %0 in table".format(val);
					}
					rowsData[j-1].push(y);
				}
			});
		});
		var data =[[], []];
		for(var i=0; i < rowsData.length; i++){
			data[0].push(xValues);
			data[1].push(rowsData[i]);
		}
		return {legend: headings, xValues: data[0], yValues: data[1], mapX: mapX };
	}
};

var barMacro = config.macros.BarChart = {
	handler: function(place,macroName,params,wikifier,paramString,tiddler) {
		var options = macro.getOptions(paramString);
		var data = pieMacro.getData(params[0], options);
		var r = macro.createCanvas(place, options);
		var chart = r.g.barchart(50, 50, options.width - 50, options.height - 50, [data.values], {stacked: true, type: options.barEdges});
		chart.label(data.legend);
		chart.hover(function() {
				// Create a popup element on top of the bar
				this.flag = r.g.popup(this.bar.x, this.bar.y, (this.bar.value	|| "0")).insertBefore(this);
		}, function() {
				// hide the popup element with an animation and remove the popup element at the end
				this.flag.animate({opacity: 0}, 300, function () {this.remove();});
		});
		
	}
};


})(jQuery);
//}}}