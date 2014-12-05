var util = require('./util/util');
var controls = require('./util/controls');
var home = controls.home;
var quote = controls.quote;
var constants = require('./util/constants')

describe('home:', function () {
    this.timeout(99999);

    beforeEach(function () {
        util.go();
        home.zip.clear();
    });

    it('entering zip code displays single county', function () {
        home.zip.sendKeys(constants.zipWithSingleCounty);
        home.counties.count().should.eventually.equal(2); // First option is 'Select County'
        // home.counties.getAttibute('value').getText().should.eventually.match(/York/);
    })

    it('entering zip code displays multiple counties', function () {
        home.zip.sendKeys(constants.zipWithMultipleCounties);
        home.counties.count().should.eventually.equal(3);
        home.counties.get(1).getText().should.eventually.match(/Cumberland/);
        home.counties.get(2).getText().should.eventually.match(/York/);
    });

    it('with required fields returns medical quote', function () {
        home.zip.sendKeys(constants.zipWithMultipleCounties);
        home.counties.get(1).click();
        home.dependents.get(0).element(by.model('dependent.dob')).sendKeys('07/06/1986');
        home.quoteBtn.click();
    });

    it('with spouse and child dependency fields returns medical quote', function () {
        home.zip.sendKeys(constants.zipWithMultipleCounties);
        home.counties.get(1).click();
        home.dependents.get(0).element(by.model('dependent.dob')).sendKeys('07/06/1986');

        home.insuranceTypes.get(1).click();
        home.addDependentBtn.click();
        home.dependents.get(1).all(by.css('[ng-options *= getRelationships] option')).get(1).click();
        home.dependents.get(1).element(by.model('dependent.dob')).sendKeys('07/06/1986');

        home.addDependentBtn.click();
        home.dependents.get(2).all(by.css('[ng-options *= getRelationships] option')).get(2).click();
        home.dependents.get(2).element(by.model('dependent.dob')).sendKeys('07/06/1986');

        home.quoteBtn.click();
    });
    
    it('allows addition and deletion of dependents', function () {
        home.zip.sendKeys(constants.zipWithMultipleCounties);
        home.counties.get(1).click();

        for (var i = 0; i < 2; ++i) {
            home.dependents.count().should.eventually.equal(i + 1);
            home.addDependentBtn.click();
        }
        for (i = 2; i >= 0; --i) {
            home.dependents.count().should.eventually.equal(i + 1);
            home.dependents.get(i).element(by.css('[ng-click ^= removeDependent]')).click();
        }
        home.dependents.count().should.eventually.equal(1);
    });

});