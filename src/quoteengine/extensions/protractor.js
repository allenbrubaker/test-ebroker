var proto = protractor.promise.Promise.prototype;

proto.sleep = function (ms) {
    return browser.sleep(ms);
}

proto.isDisabled = function () {
    return this.getAttribute('disabled').then(function (x) {
        return x === 'true';
    });
}

proto.isEnabled = function () {
    return this.isDisabled().then(function (d) {
        return !d;
    });
}

Promise.prototype.zip = function (array2) {
    var a2 = Promise.resolve(array2)
    return this.map(function (x, index, length) {
        return Promise.all([x, a2.get(index)])
    })
}

Promise.zip = function (array1, array2) {
    return Promise.resolve(array1).zip(array2)
}
