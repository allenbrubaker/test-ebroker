var proto = require('protractor').promise.Promise.prototype;

Object.defineProperty(
    proto,
    'should',
    Object.getOwnPropertyDescriptor(Object.prototype, 'should')
);

proto.sleep = function (ms) {
    return browser.sleep(ms);
}

proto.isDisabled = function () {
    return this.getAttribute('disabled').then(function(x) { return x === 'true'; });
}

proto.isEnabled = function () {
    return this.isDisabled().then(function(d) { return !d; });
}