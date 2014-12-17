exports.load = function () {
    var chai = require('chai');
    var chaiAsPromised = require('chai-as-promised');
    chai.use(chaiAsPromised);
    var should = chai.should();

    Promise = require('bluebird');
    require('./extensions/bluebird');
    require('./extensions/protractor');
}