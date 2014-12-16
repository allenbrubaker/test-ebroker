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
            quote.filter.expandCarrierFilter().then(function () {
                return quote.filter.clickCarrier(/healthamericaone/i);
            }).then(function () {
                quote.allCarriersNotDisplaying('healthamericaone').should.eventually.be.true;
            });
        });

        it('shows only HSA eligible on filter', function (done) {
            quote.filter.expandPlanTypeFilter()
                .then(quote.filter.clickShowOnlyHsa)
                .then(quote.allHsaEligible)
                .then(function (allHsaEligible) {
                    allHsaEligible.should.be.true;
                })
        });

        it('metalType filter functions correctly', function () {
            quote.filter.expandMetalTypeFilter().then(function () {
                return quote.filter.clickMetalType(/bronze/i);
            }).then(function () {
                return quote.allMetalTypesNotDisplaying('bronze');
            }).then(function (notDisplaying) {
                notDisplaying.should.be.true;
            });
        });

        it('shows plan info modal on plan info button click', function () {
            quote.plans().spread(function(plan) { 
                return Promise.props({
                    name: plan.name(),
                    premium: plan.premium()
                })
                .then(function (result) {
                    return plan.showPlanInfo().then(function () {
                        return Promise.props({
                            name: plan.planInfo.name(),
                            premium: plan.planInfo.premium()
                        })
                        .then(function (info) {
                            result.name.should.equal(info.name);
                            result.premium.should.equal(info.premium);
                        })
                    })
                })
            })
        });
        
        
    });

    describe("sort:", function () {
        it('displays premium in descending order', function () {
            quote.sort.sortPremium(false).then(function () {
                return quote.isSorted(function (plan) {
                    return plan.premium();
                }, false).should.eventually.be.true;
            })
        })

        it('displays premium in ascending order', function () {
            quote.sort.sortPremium(true).then(function () {
                return quote.isSorted(function (plan) {
                    return plan.premium();
                }, true).should.eventually.be.true;
            })
        })
        it('displays deductible in descending order', function () {
            quote.sort.sortDeductible(false).then(function () {
                return quote.isSorted(function (plan) {
                    return plan.deductible();
                }, false).should.eventually.be.true;
            })
        })
        it('displays deductible in ascending order', function () {
            quote.sort.sortDeductible(true).then(function () {
                return quote.isSorted(function (plan) {
                    return plan.deductible();
                }, true).should.eventually.be.true;
            })
        })
    })
});