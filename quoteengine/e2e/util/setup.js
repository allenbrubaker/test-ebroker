exports.load = function () {
    Promise = require('bluebird');
    require('./bluebirdExtensions');

    Promise.promisifyAll(require('protractor'));
    var chai = require('chai');
    var chaiAsPromised = require('chai-as-promised');
    chai.use(chaiAsPromised);
    var should = chai.should();

    Object.defineProperty(
        protractor.promise.Promise.prototype,
        'should',
        Object.getOwnPropertyDescriptor(Object.prototype, 'should')
    );

    protractor.promise.Promise.prototype.sleep = function (ms) {
        return browser.sleep(ms);
    }
    
}