exports.load = function () {
    Promise = require('bluebird');
    require('./extensions/bluebird');
    require('./extensions/protractor');
    require('./extensions/string');
    
    var chai = require('chai');
    var chaiAsPromised = require('chai-as-promised');
    chai.use(chaiAsPromised);
    var should = chai.should();

    Object.defineProperty(
        protractor.promise.Promise.prototype,
        'should',
        Object.getOwnPropertyDescriptor(Object.prototype, 'should')
    );
}