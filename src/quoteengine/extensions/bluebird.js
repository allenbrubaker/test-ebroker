    Promise = require('bluebird')

     Promise.prototype.every = function (predicate) {
    	return this.reduce(function (acc, element) {
    		if (!acc) return false
    		return predicate(element).then(function (satisfies) {
    			return acc && satisfies
    		})
    	}, true)
    }

    Promise.prototype.exists = function (predicate) {
    	return this.reduce(function (acc, element) {
    		if (acc) return true
    		return predicate(element).then(function (satisfies) {
    			return acc || satisfies
    		})
    	}, false)
    }

    Promise.prototype.take = function (count) {
    	return this.filter(function (value, index, length) {
    		return index < count
    	})
    }

    Promise.prototype.first = function () {
        console.log(this);
    	return this.get(0)
    }

    Promise.prototype.last = function () {
    	return this.then(function (array) {
    		return array[array.length - 1]
    	})
    }

    Promise.prototype.zip = function (array2) {
    	var a2 = Promise.resolve(array2) // convert to promise if it already isn't one.
    	return this.map(function (x, index, length) {
    		return Promise.all([x, a2.get(index)])
    	})
    }

    Promise.zip = function (array1, array2) {
    	return Promise.resolve(array1).zip(array2)
    }