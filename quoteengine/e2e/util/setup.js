
exports.load = function () {
    Promise = require('bluebird');
    Promise.promisifyAll(require('protractor'));
    var chai = require('chai');
    var chaiAsPromised = require('chai-as-promised');
    chai.use(chaiAsPromised);
    var should = chai.should();
    var expect = chai.expect;

    Object.defineProperty(
        protractor.promise.Promise.prototype,
        'should',
        Object.getOwnPropertyDescriptor(Object.prototype, 'should')
    );
    
}