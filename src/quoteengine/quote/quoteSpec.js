var Quote = require('./Quote');

describe('quote:', function () {

    this.timeout(99999)

    var quote;
    var taxCredit;
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
                    return quote.allPremiumsAtMostFilter().should.eventually.be.true
                })
                .then(function () {
                    return quote.filter.movePremiumSlider(20 * 1.2)
                })
        })

        it('all plans shown contain deductibles at most max deductible', function () {
            quote.filter.expandPriceFilter()
            quote.filter.moveDeductibleSlider(-30)
                .then(function () {
                    return quote.allDeductiblesAtMostFilter().should.eventually.be.true
                })
                .then(function () {
                    return quote.filter.moveDeductibleSlider(30 * 1.2)
                })
        })

        it('carriers filter functions correctly', function () {
            quote.filter.expandCarrierFilter().then(function () {
                return quote.filter.clickCarrier(/healthamericaone/i).then(quote.filter.expandCarrierFilter);
            }).then(function () {
                return quote.allCarriersNotDisplaying('healthamericaone').should.eventually.be.true
            })
        })

        it('shows only HSA eligible on filter', function () {
            quote.filter.expandPlanTypeFilter()
                .then(quote.filter.clickShowOnlyHsa)
                .then(function () {
                    return quote.allHsaEligible().should.eventually.be.true
                })
        })

        it('metalType filter functions correctly', function () {
            quote.filter.expandMetalTypeFilter().then(function () {
                return quote.filter.clickMetalType(/bronze/i)
            }).then(function () {
                return quote.allMetalTypesNotDisplaying('bronze').should.eventually.be.true
            })
        })

    })

    describe("sort:", function () {
        it('displays premium in descending order', function () {
            quote.sort.sortPremium(false).then(function () {
                return quote.isSorted(function (plan) {
                    return plan.premium()
                }, false).should.eventually.be.true
            })
        })

        it('displays premium in ascending order', function () {
            quote.sort.sortPremium(true).then(function () {
                return quote.isSorted(function (plan) {
                    return plan.premium()
                }, true).should.eventually.be.true
            })
        })
        it('displays deductible in descending order', function () {
            quote.sort.sortDeductible(false).then(function () {
                return quote.isSorted(function (plan) {
                    return plan.deductible()
                }, false).should.eventually.be.true
            })
        })
        it('displays deductible in ascending order', function () {
            quote.sort.sortDeductible(true).then(function () {
                return quote.isSorted(function (plan) {
                    return plan.deductible()
                }, true).should.eventually.be.true
            })
        })
    })

    describe('cart:', function () {

        it('clicking plan info shows plan detail modal with correct data', function () {
            quote.plans().spread(function (plan) {
                return Promise.all([plan, plan.name(), plan.premium()])
            }).spread(function (plan, name, premium) {
                return plan.showPlanInfo()
                    .then(function () {
                        return plan.planInfo.containsPlan(name, premium).should.eventually.be.true
                    }).then(plan.planInfo.clickClose)
            })
        })

        it('comparing plans displays details for each plan on compare page', function () {
            quote.plans().take(2).map(function (p) {
                return p.clickCompare().then(function () {
                    return Promise.props({
                        name: p.name(),
                        premium: p.premium()
                    })
                })
            }).then(function (plans) {
                return quote.clickComparePlans()
                    .then(function () {
                        return plans.every(function (plan) {
                            return quote.compare.containsPlan(plan.name, plan.premium);
                        }).should.eventually.equal(true)
                    })
            }).then(quote.comparePage().clickBack)
        })

        it('selecting a plan navigates to cart, which contains the plan.', function () {
            Promise.resolve(quote.filter.expandPlanTypeFilter())
                .then(quote.filter.clickMarketplacePlans)
                .then(quote.plans)
                .spread(function (plan) {
                    return Promise.props({
                        select: plan.select,
                        name: plan.name(),
                        premium: plan.premium()
                    })
                })
                .then(function (plan) {
                    return plan.select().then(function () {
                        return quote.cart.containsPlan(plan.name, plan.premium)
                    })
                }).then(function (contains) {
                    return contains.should.be.true;
                })
        })

        it('selecting a plan can be checked out with an agent selected', function () {
            Promise.resolve(quote.filter.expandPlanTypeFilter())
                .then(quote.filter.clickMarketplacePlans)
                .then(quote.plans)
                .first()
                .call('select')
                .then(quote.cart.checkout)
                .then(quote.cart.agents)
                .first()
                .call('select')
                .then(quote.load)
        })

    })

    describe.only("taxcredit:", function () {
        it('should follow all the steps and display a tax credit of $28.67.', function () {
            quote.taxCredit.computeTaxCredit()
        });

        it('should check all the premiums to ensure the taxcredit was applied correctly', function () {
            quote.taxCredit.isCorrectPremium()
        });
    });

})