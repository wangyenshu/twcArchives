(function() {
for (var i = 0; i < config.formatters.length; i++)
    if (config.formatters[i].name == "strikeByChar")
        break;
if (i < config.formatters.length)
    config.formatters.splice(i,1);
})(); 