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
                    return quote.filter.movePremiumSlider(20 * 1.1);
                });
        });

        it('all plans shown contain deductibles at most max deductible', function () {
//            quote.filter.expandPriceFilter()
            quote.filter.moveDeductibleSlider(-30)
                .then(function () {
                    return quote.assertDeductiblesAtMostFilter();
                })
                .then(function () {
                    return quote.filter.moveDeductibleSlider(30 * 1.1);
                });
        });

        it('carriers filter functions correctly', function () {
            quote.filter.expandCarriersFilter().then(function () {
                return quote.filter.clickCarrier(/healthamericaone/i);
            }).then(function () {
                return quote.assertCarriersNotDisplayed('healthamericaone');
            });
        });
        
        
    });
});
