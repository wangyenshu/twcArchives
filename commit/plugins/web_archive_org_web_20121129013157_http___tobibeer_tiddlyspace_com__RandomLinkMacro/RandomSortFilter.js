/***
|''Name''|RandomSortFilter|
|''Version''|0.1.2|
!Description
Updates the sort filter to take a keyword *random
!Usage
{{{
[sort[*random]]
}}}
***/
//{{{
(function() {
var _sort = config.filters.sort;
config.filters.sort = function(results,match) {
	if(match[3] === "*random") {
		results = results.sort(function(a, b) {
			var r = Math.random();
			return r < 0.5 ? -1 : 1;
		});
		return results;
	} else {
		return _sort.apply(this, arguments);
	}
};
})();
//}}}
