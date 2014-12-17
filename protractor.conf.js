exports.config = {
  framework:'mocha',
  //seleniumAddress: 'http://localhost:4444/wd/hub',
  seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.44.0.jar',
  specs: ['quoteengine/**/*Spec.js'],
  baseUrl: 'https://testquote.ioixsoftware.com/#!',
  onPrepare: function() {
      var setup = require('./quoteengine/setup.js');
      setup.load();
  }
}