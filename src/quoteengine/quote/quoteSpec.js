var Quote = require('./Quote')
var Application = require('../application/Application')

describe('quote:', function () {

    this.timeout(99999)

    var quote, app

    before(function () {
        quote = new Quote()
        app = new Application()
        quote.load()
    })

    beforeEach(function () {
        quote.removePopups() // Remove popups that occlude controls and result in failing tests.
        quote.scrollUp()

    })

    describe('filters:', function () {

        it('all plans shown contain premiums at most max premium', function () {
            return quote.filter.expandPriceFilter()
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
            return quote.filter.expandPriceFilter()
                .then(function () {
                    return quote.filter.moveDeductibleSlider(-30)
                })
                .then(function () {
                    return quote.allDeductiblesAtMostFilter().should.eventually.be.true
                })
                .then(function () {
                    return quote.filter.moveDeductibleSlider(30 * 1.2)
                })
        })

        it('carriers filter functions correctly', function () {
            return quote.filter.expandCarrierFilter().then(function () {
                return quote.filter.clickCarrier(/healthamericaone/i).then(quote.filter.minimizeCarrierFilter)
            }).then(function () {
                return quote.allCarriersNotDisplaying('healthamericaone').should.eventually.be.true
            })
        })

        it('shows only HSA eligible on filter', function () {
            return quote.filter.expandPlanTypeFilter()
                .then(quote.filter.clickShowOnlyHsa)
                .then(function () {
                    return quote.allHsaEligible().should.eventually.be.true
                })
                .then(quote.filter.clickShowOnlyHsa)
        })

        it('metalType filter functions correctly', function () {
            return quote.filter.expandMetalTypeFilter().then(function () {
                return quote.filter.clickMetalType(/bronze/i)
            }).then(function () {
                return quote.allMetalTypesNotDisplaying('bronze').should.eventually.be.true
            })
        })

        it('disclaimer visible on expanding disclaimer pane', function () {
            return quote.filter.expandDisclaimer()
                .then(quote.filter.disclaimerText)
                .then(function (disclaimer) {
                    var match = disclaimer.match(/In offering this website, eBroker is required to comply with all applicable federal laws/i)
                    match.should.be.truthy;
                    return match;
                })
        })

        it('metal levels info visible on expanding metal info pane', function () {
            return quote.filter.expandMetalTypeInfo()
                .then(quote.filter.metalTypeInfoText)
                .then(function (info) {
                    var match = info.match(/platinum/i) != null && info.match(/gold/i) != null && info.match(/silver/i) != null && info.match(/bronze/i) != null
                    match.should.be.true;
                    return match;
                })
        })

    })

    describe('plan:', function () {
        it('ability to select more info button', function () {
            return quote.plans().first().call('showMore')
        })
    })

    describe("sort:", function () {
        it('displays premium in descending order', function () {
            return quote.sort.sortPremium(false).then(function () {
                return quote.isSorted(function (plan) {
                    return plan.premium()
                }, false).should.eventually.be.true
            })
        })

        it('displays premium in ascending order', function () {
            return quote.sort.sortPremium(true).then(function () {
                return quote.isSorted(function (plan) {
                    return plan.premium()
                }, true).should.eventually.be.true
            })
        })
        it('displays deductible in descending order', function () {
            return quote.sort.sortDeductible(false).then(function () {
                return quote.isSorted(function (plan) {
                    return plan.deductible()
                }, false).should.eventually.be.true
            })
        })
        it('displays deductible in ascending order', function () {
            return quote.sort.sortDeductible(true).then(function () {
                return quote.isSorted(function (plan) {
                    return plan.deductible()
                }, true).should.eventually.be.true
            })
        })
    })

    describe('cart:', function () {

        it('clicking plan info shows plan detail modal with correct data', function () {
            return quote.plans().spread(function (plan) {
                return Promise.all([plan, plan.name(), plan.premium()])
            }).spread(function (plan, name, premium) {
                return plan.showPlanInfo()
                    .then(function () {
                        return plan.planInfo.containsPlan(name, premium).should.eventually.be.true
                    })
                    .then(plan.planInfo.clickClose)
            })
        })

        it('clicking compare checkbox on each displays details for each selected plan on compare page', function () {
            return quote.plans().take(2).map(function (p) {
                    return p.clickCompare().then(function () {
                        return Promise.props({
                            name: p.name(),
                            premium: p.premium()
                        })
                    })
                })
                .then(quote.removePopups)
                .then(function (plans) {
                    return quote.clickComparePlans()
                        .then(function () {
                            return plans.every(function (plan) {
                                return quote.compare.containsPlan(plan.name, plan.premium)
                            })
                        })
                })
                .then(quote.removePopups)
                .then(function (contains) {
                    return contains.should.be.true
                })
                .then(quote.removePopups)
                .then(quote.compare.clickBack)
        })

        it('selecting a plan navigates to cart, which contains the plan.', function () {
            return Promise.resolve(quote.filter.expandPlanTypeFilter())
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
                    return contains.should.be.true
                }).then(quote.cart.clickBack);
        })

    })

    describe("tax credit:", function () {
        it('should follow all the steps and display a tax credit of $28.67.', function () {
            return quote.taxCredit.computeTaxCredit()
        })

        it('should check all the premiums to ensure the taxcredit was applied correctly', function () {
            return quote.taxCredit.isCorrectPremium()
        })
    })

    describe('location:', function () {
        var l

        before(function () {
            l = quote.location
        })

        it('entering zip code displays single county', function () {
            return quote.filter.expandLocationPane()
                .then(quote.filter.editLocation)
                .then(l.clearZip)
                .then(function () {
                    return l.enterZip('17012')
                })
                .then(function () {
                    return l.assertCountyCount(1)
                })
        })

        it('entering zip code displays multiple counties', function () {
            return Promise.resolve(l.clearZip())
                .then(function () {
                    return l.enterZip('17055')
                })
                .then(function () {
                    return [l.assertCountyCount(2), l.assertCountyName(0, /Cumberland/), l.assertCountyName(0, /Cumberland/)]
                })
                .all().then(l.submit).then(l.expandLocationPane)
        })
    })

    describe('dependents:', function () {
        var d, dob
        before(function () {
            d = quote.dependents
            dob = '07/06/1986'
        })

        beforeEach(function () {
            return quote.filter.expandDependentsPane().then(quote.filter.editDependents);
        })

        afterEach(function () {
            return d.closeModal()
        })

        it('with required fields returns medical quote', function () {
            return d.addSelf(true, dob, false)
        })

        it('with spouse and child dependency fields returns medical quote', function () {
            return d.addSelf(true, dob, false)
                .then(function () {
                    return d.addSpouse(false, dob, true)
                })
                .then(function () {
                    return d.addChild(true, dob, false)
                })
                .then(function () {
                    return d.removeDependent()
                }).then(function () {
                    d.removeDependent()
                });
        })

        it('allows addition and deletion of dependents', function () {
            return d.addSelf(true, dob, false)
                .then(function () {
                    return d.assertDependentsCount(1)
                })
                .then(function () {
                    return d.addSpouse()
                })
                .then(function () {
                    return d.assertDependentsCount(2)
                })
                .then(function () {
                    return d.addChild()
                })
                .then(function () {
                    return d.assertDependentsCount(3)
                })
                .then(function () {
                    return d.removeDependent()
                })
                .then(function () {
                    return d.assertDependentsCount(2)
                })
                .then(function () {
                    return d.removeDependent()
                })
                .then(function () {
                    return d.assertDependentsCount(1)
                })
        })

    })

    // The following tests are disabled because no process is in place to properly sandbox agency central for mock testing.
    xdescribe('integration:', function () {
        it('checkout plan with an agent and login into agency central', function () {
            return quote.checkout()
                .then(app.login)
                .then(quote.load)
        })

        it('checkout plan with an agent can be saved in agency central', function () {
            return quote.checkout()
                .then(app.login)
                .then(app.saveApplicationAndLogout)
                .then(app.login)
                .then(app.isAppSavedToday)
                .then(function (contains) {
                    return contains.should.be.true
                })
                .then(quote.load)
        })

        it('save plan comparison in agency central', function () {
            return quote.plans().take(2).map(function (p) {
                    return p.clickCompare().then(function () {
                        return Promise.props({
                            name: p.name(),
                            premium: p.premium()
                        })
                    })
                })
                .then(function (plans) {
                    return quote.clickComparePlans()
                        .then(quote.compare.save)
                        .then(quote.compare.selectFirstAgent)
                        .then(app.login)
                        .then(app.saveComparison)
                        .then(app.openFirstComparison)
                        .then(function () {
                            return plans.every(function (plan) {
                                return quote.compare.containsPlan(plan.name, plan.premium)
                            })
                        })
                })
                .then(function (contains) {
                    return contains.should.be.true
                })
                .then(quote.compare.clickBack)

        })

        it('save plan quote in agency central', function () {
            return Promise.resolve(quote.filter.expandPlanTypeFilter())
                .then(quote.filter.clickMarketplacePlans)
                .then(quote.plans)
                .first()
                .then(function (plan) {
                    return [plan.name(), plan.premium()]
                })
                .all()
                .spread(function (name, premium) {
                    return quote.selectFirstPlan()
                        .then(quote.cart.save)
                        .then(quote.compare.selectFirstAgent) // use compare because agents show up as a modal.
                        .then(app.login)
                        .then(app.saveQuote)
                        .then(app.quotes)
                        .last()
                        .then(function (q) {
                            return q.isContainPlan(name, premium)
                        })
                        .should.eventually.be.true
                })
        })

        it('checkout and register new user successfully', function () {
            return quote.checkout().then(app.register)
        })


    })

})