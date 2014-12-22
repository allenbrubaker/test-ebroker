(function () {

    var Home = require('../home/Home');
    var Cart = require('./Cart');
    var Plan = require('./Plan');
    var Filter = require('./Filter');
    var TaxCredit = require('./TaxCredit');
    var Sort = require('./Sort');

    module.exports = Quote;

    function Quote() {
        var self = this;

        var controls = {
            modalClose: $('.modal-dialog [ng-click ^= cancel]'),
            plans: element.all(by.repeater('plan in plans')),
            filter: $('[ng-controller = filterController'),
            comparePlans: $('[ui-sref^="quote.compare"]'),
        }

        self.plans = function () {
            var plans = controls.plans.map(function (control) {
                return new Plan(control);
            });
            return Promise.resolve(plans);
        }

        self.filter = new Filter(controls.filter);
        self.cart = new Cart();
        self.compare = new Cart(null, 'plan');
        self.sort = new Sort();
        self.taxCredit = new TaxCredit();

        self.load = function () {
            browser.driver.manage().window().maximize() // needed for sliders to function correctly.
            Home.login();
            controls.modalClose.click();
            browser.ignoreSynchronization = true;
            browser.sleep(4000);
        };

        self.closeModal = function () {
            return controls.modalClose.click();
        }

        self.allPremiumsAtMostFilter = function () {
            return self.filter.maxPremium().then(function (max) {
                return self.plans().every(function (plan) {
                    return plan.premium().then(function (p) {
                        return p <= max
                    });
                })
            })
        }

        self.allDeductiblesAtMostFilter = function () {
            return self.filter.maxDeductible().then(function (max) {
                return self.plans().every(function (plan) {
                    return plan.deductible().then(function (d) {
                        return d <= max
                    });
                })
            })
        }

        self.allCarriersNotDisplaying = function (logoName) {
            return self.plans().every(function (plan) {
                return plan.carrier().then(function (carrier) {
                    return carrier.toLowerCase() != logoName.toLowerCase();
                });
            });
        }

        self.allMetalTypesNotDisplaying = function (metalType) {
            return self.plans().every(function (plan) {
                return plan.metal().then(function (x) {
                    return x.toLowerCase() != metalType.toLowerCase();
                });
            });
        }

        self.allHsaEligible = function () {
            return self.plans().every(function (plan) {
                return plan.isHsaEligible();
            });
        }

        self.isSorted = function (getValue, isAscending) {
            return self.plans().reduce(function (acc, plan) {
                return getValue(plan).then(function (p) {
                    acc.passes = acc.passes && (isAscending ? acc.value <= p : acc.value >= p);
                    acc.value = p;
                    return acc;
                });
            }, {
                passes: true,
                value: isAscending ? -99999 : 99999
            }).then(function (acc) {
                return acc.passes;
            });
        }

        self.clickComparePlans = function () {
            return controls.comparePlans.click().sleep(4000);
        }

    }

})();