var util = require('./util/util');
var controls = require('./util/controls');
var home = controls.home;
var quote = controls.quote;
var constants = require('./util/constants');

describe.only('quote:', function () {
    this.timeout(99999);
    loadQuotePage();

    describe('filters:', function () {

        it('maximum premium price filters correctly', function (done) {
            wait();
            quote.filters.pricePane.click();
            element(by.binding('filters.maxPrice')).getText().then(function(x) {
                
                var maxPrice = x.trimCurrency;
                console.log(maxPrice);
                element.all(by.css('[ng-bind ^= "plan.premium"]')).each(function(x) { 
                   x.getText().then(function(raw) {
                       var premium = raw.trimCurrency();
                       premium.should.be.at.most(maxPrice);
                       console.log(premium + ' < ' + maxPrice);
                   }) 
                });
            });
        });
    });

    function loadQuotePage() {
        util.go()
        home.zip.sendKeys(constants.zipWithSingleCounty);
        home.dependents.get(0).element(by.model('dependent.dob')).sendKeys(constants.dob);
        home.quoteBtn.click();
        quote.modalClose.click();
        browser.ignoreSynchronization = true;
    };
    
    function wait() {
        browser.sleep(2000);
    }
});