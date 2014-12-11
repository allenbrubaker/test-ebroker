var Quote = require('./util/Quote');
var Home = require('./util/Home');

describe('quote:', function () {
    this.timeout(99999);

    var quote;

    before(function () {
        quote = new Quote();
        quote.load();
    });

    describe('filters:', function () {

        it('all plans shown contain premiums at most max premium', function () {
            quote.filter.expandPriceFilter()
                .then(function () {
                    return quote.filter.movePremiumSlider(-20)
                })
                .then(function () {
                    return quote.assertPremiumsAtMostFilter();
                })
                .then(function () {
                    return quote.filter.movePremiumSlider(20);
                }).then(function () {
                    return browser.sleep(10000);
                });
        });

        it('all plans shown contain deductibles at most max deductible', function () {
            //quote.expandPriceFilter()
            quote.filter.moveDeductibleSlider(-30)
            quote.assertDeductiblesAtMostFilter();
            quote.filter.moveDeductibleSlider(30);
        });

        it('carriers filter functions correctly', function () {
            quote.filter.expandCarriersFilter();
            quote.clickCarrierFilter(/healthamericaone/i);
            quote.assertCarriersNotDisplayed('healthamericaone');
        })
    });
});