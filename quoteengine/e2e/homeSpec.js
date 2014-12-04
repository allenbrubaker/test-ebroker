var util = require('./util/util.js');

describe('landing', function () {
this.timeout(99999);

var zip = element(by.model('$root.zipcode'));
var counties = element(by.model('$root.county')).all(by.css('option'));
var selectedCounty = element(by.model('$root.county'));
var zipWithSingleCounty = '17402',
    zipWithMultipleCounties = '17055';
var dob = element(by.model('dependent.dob'));
var addDependentBtn = element(by.css('a[ng-click ^= addDependent]'));
var quoteBtn = element(by.css('a[ng-click ^= toQuote]'));
var insuranceTypes = element.all(by.repeater('insurance in $root.insuranceTypes'));
var dependents = element.all(by.repeater('dependent in dependents'));

beforeEach(function () {
    util.go();
    zip.clear();
});

it('entering zip code displays single county', function () {
    zip.sendKeys(zipWithSingleCounty);
    counties.count().should.eventually.equal(2); // First option is 'Select County'
    //            counties.getAttibute('value').getText().should.eventually.match(/York/);
})

it('entering zip code displays multiple counties', function () {
    zip.sendKeys(zipWithMultipleCounties);
    counties.count().should.eventually.equal(3);
    counties.get(1).getText().should.eventually.match(/Cumberland/);
    counties.get(2).getText().should.eventually.match(/York/);
});

it('with required fields returns medical quote', function () {
    zip.sendKeys(zipWithMultipleCounties);
    counties.get(1).click();
    dependents.get(0).element(by.model('dependent.dob')).sendKeys('07/06/1986');
    quoteBtn.click();
    util.click('.modal-dialog [ng-click ^= cancel]')
});

it('with spouse and child dependancy fields returns medical quote', function () {
    zip.sendKeys(zipWithMultipleCounties);
    counties.get(1).click();
    dependents.get(0).element(by.model('dependent.dob')).sendKeys('07/06/1986');

    insuranceTypes.get(1).click();
    addDependentBtn.click();
    dependents.get(1).all(by.css('[ng-options *= getRelationships] option')).get(1).click();
    dependents.get(1).element(by.model('dependent.dob')).sendKeys('07/06/1986');

    addDependentBtn.click();
    dependents.get(2).all(by.css('[ng-options *= getRelationships] option')).get(2).click();
    dependents.get(2).element(by.model('dependent.dob')).sendKeys('07/06/1986');

    quoteBtn.click();
    util.click('.modal-dialog [ng-click ^= cancel]')

});

it('allows addition and deletion of dependents', function() {
    zip.sendKeys(zipWithMultipleCounties);
        counties.get(1).click();

    for (var i=0; i<2; ++i)
    {
        dependents.count().should.eventually.equal(i+1);
        addDependentBtn.click();
    }
    for (i=2; i>=0; --i)
    {
        dependents.count().should.eventually.equal(i+1);
        dependents.get(i).element(by.css('[ng-click ^= removeDependent]')).click();
    }
    dependents.count().should.eventually.equal(1);
});
    
});