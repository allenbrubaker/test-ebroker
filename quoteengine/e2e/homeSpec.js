var util = require('./util/util.js');

describe('landing', function () {
    this.timeout(99999);

    beforeEach(function () {
        util.go();
    });

    describe('entering zip', function () {
        var zip = element(by.model('$root.zipcode'));
        var counties = element(by.model('$root.county')).all(by.css('option'));
        var selectedCounty = element(by.model('$root.county'));
        var zipWithSingleCounty = '17402',
            zipWithMultipleCounties = '17055';
        var dob = element(by.model('dependent.dob'));
        var addDependantBtn = element(by.css('[ng-click ^= addDependent]'));        
        var quoteBtn = element(by.css('[ng-click ^= toQuote]'));


        beforeEach(function () {
            zip.clear();
        });

        it('displays single county', function () {
            zip.sendKeys(zipWithSingleCounty);
            counties.count().should.eventually.equal(2); // First option is 'Select County'
            //            counties.getAttibute('value').getText().should.eventually.match(/York/);
        })

        it('displays multiple counties', function () {
            zip.sendKeys(zipWithMultipleCounties);
            counties.count().should.eventually.equal(3);
            counties.get(1).getText().should.eventually.match(/Cumberland/);
            counties.get(2).getText().should.eventually.match(/York/);
        });

        it('with required fields returns medical quote', function () {
            zip.sendKeys(zipWithMultipleCounties);
            counties.get(1).click();
            dob.sendKeys('07/06/1986');
            quoteBtn.click();
        })

    });
   
});