String.prototype.trimStr = function (s) {
    return this.replace(new RegExp("^" + s + "+|" + s + "+$", "gm"), "");
}

String.prototype.trimCurrency = function () {
    return Number(this.replace('$', '').replace(',', ''));
}


// escapes patternString to valid regex pattern, converts to regex object, then matches string
String.prototype.matchString = function (patternString, flags) {
    return RegExp(escapeRegex(name), flags).exec(this)

    function escapeRegex(str) {
        return str.toString().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
}