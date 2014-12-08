var settings = require('../../../protractor.conf.js');
exports.baseUrl = settings.config.baseUrl;

exports.title = function (match) {
    browser.getTitle().should.eventually.match(match);
}

exports.text = function (selector, match) {
    $(selector).getText().should.eventually.match(match);
}

exports.h1 = function (match) {
    exports.text('h1', match);
}

exports.go = function (relativeUrl) {
    relativeUrl = (relativeUrl || '').trimStr('/');
    browser.get(relativeUrl);
};

exports.click = function (selector) {
    $(selector).click();
};

exports.clear = function (selector) {
    $(selector).clear();
};

String.prototype.trimStr = function(s) {
    return this.replace(new RegExp("^" + s + "+|" + s + "+$", "gm"), "");
}

String.prototype.trimCurrency = function() {
    return Number(this.replace('$', '').replace(',', ''));
}

exports.url = function (relative) {
    relative= (relative || '').trimStr('/');
    browser.getCurrentUrl().should.eventually.equal(exports.baseUrl.trimStr('/') + '/' + relative);
};

exports.send = function (selector, text) {
    $(selector).sendKeys(text);
};

exports.reset = function() {
    browser.executeScript('window.localStorage.clear();');
}

exports.disabled = function(selector) {
    $(selector).getAttribute('disabled').should.eventually.equal('true');
}

exports.enabled = function(selector) {
    $(selector).getAttribute('disabled').should.eventually.be.null;
}



