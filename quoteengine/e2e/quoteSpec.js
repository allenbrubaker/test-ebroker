var util = require('./util/util.js');
var controls = require('./util/controls.js');
var home = controls.home;
var quote = controls.quote;

describe.only('quote:', function () {
    this.timeout(99999);

    loadQuotePage();

    describe('filters:', function () {

        it('maximum premium price filters correctly', function () {
            quote.filters.pricePane.click();
        });
    });

    function loadQuotePage() {
        util.go()
        home.zip.sendKeys(home.zipWithMultipleCounties);
        home.counties.get(1).click();
        home.dependents.get(0).element(by.model('dependent.dob')).sendKeys('07/06/1986');
        home.quoteBtn.click();
        quote.modalClose.click();
    };
});