    Promise = require('bluebird');

    Promise.prototype.every = function (predicate) {
        return this.reduce(function (acc, element) {
            if (!acc) return false;
            return Promise.resolve(predicate(element)).then(function (satisfies) {
                return acc && satisfies;
            });
        }, true);
    }

    Promise.prototype.exists = function (predicate) {
        return this.reduce(function (acc, element) {
            if (acc) return true;
            return Promise.resolve(predicate(element)).then(function (satisfies) {
                return acc || satisfies;
            })
        }, false)
    }

    Promise.prototype.take = function (count) {
        return this.filter(function (value, index, length) {
            return index < count;
        });
    }