String.prototype.trimStr = function(s) {
    return this.replace(new RegExp("^" + s + "+|" + s + "+$", "gm"), "");
}

String.prototype.trimCurrency = function() {
    return Number(this.replace('$', '').replace(',', ''));
}