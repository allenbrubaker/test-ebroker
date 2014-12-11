(function () {

    var Home = require('./Home');

    module.exports = Quote;

    function Quote() {
        var self = this;

        var controls = {
            modalClose: $('.modal-dialog [ng-click ^= cancel]'),
            plans: element.all(by.repeater('plan in plans')),
            filter: $('[ng-controller = filterController')
        }

        self.plans = null;
        self.filter = null;

        self.load = function () {
            browser.driver.manage().window().maximize() // needed for sliders to function correctly.
            Home.login();
            controls.modalClose.click();
            browser.ignoreSynchronization = true;
            browser.sleep(4000);
            self.plans = Promise.resolve(Plan.getPlans(controls.plans)); // convert to bluebird promises.
            self.filter = new Filter(controls.filter);
        };

        self.closeModal = function () {
            return controls.modalClose.click();
        }

        self.assertPremiumsAtMostFilter = function () {
            return self.filter.maxPremium().then(function (max) {
                return self.plans.each(function (plan, index, count) {
                    console.log(count);
                    plan.premium().should.eventually.be.at.most(max);
                })
            })
        }

        self.assertDeductibleAtMostFilter = function () {
            return self.filter.maxPremium().then(function (max) {
                self.plans.each(function (plan) {
                    plan.deductible().should.eventually.be.at.most(max);
                })
            })
        }

        self.assertCarriersNotDisplayed = function (logoName) {
            return self.plans
                .map(function (x) {
                    return x.Carrier();
                })
                .filter(function (x) {
                    return x.toLowerCase().equal(logoName.toLowerCase());
                })
                .then(function (array) {
                    array.should.be.empty;
                    return array;
                });
        }
    }

    Plan.getPlans = function (plans) {
        return plans.map(function (control) {
            return new Plan(control);
        });
    }


    function Plan(control) {
        var self = this;

        var controls = {
            deductible: control.element(by.binding('plan.deductible')),
            premium: control.element(by.binding('plan.premium')),
            hsaEligible: control.element(by.css('.fa-times.ng-hide[ng-show="plan.hsa_eligible"]')),
            carrier: control.element(by.css('.quote-logo img')),
            metalLevel: control.element(by.binding('plan.metal_level')),
            compare: control.element(by.css('.compare-tick')),
            select: control.element(by.css('a[ui-sref ^= "quote.cart"]'))
        }

        self.deductible = function () {
            return controls.deductible
                .getText().then(function (x) {
                    return x.trimCurrency();
                });
        };

        self.premium = function () {
            return controls.premium
                .getText().then(function (x) {
                    return x.trimCurrency();
                });
        };

        self.isHsaEligible = function () {
            return controls.hsaEligible
                .count().then(function (x) {
                    return x > 0;
                });
        };

        self.carrier = function () {
            return controls.carrier.getCssValue('src').then(function (s) {
                return s.match(/.*\/(.+)\.jpg/i)[0].replace('logo', '');
            });
        };

        self.metalLevel = function () {
            return controls.metalLevel.getText();
        };

        self.clickCompare = function () {
            return controls.compare.click();
        }

        self.selectPlan = function () {
            return controls.select.click();
        }
    }

    function Filter(control) {
        var self = this;

        var controls = {
            pricePane: control.$('.panel-primary-inner .fa-dollar + .fa-caret-right'),
            premium: control.element(by.binding('filters.maxPrice')),
            deductible: control.element(by.binding('filters.maxDeductible')),
            premiumSliderThumb: control.$('[slider-model="filters.maxPrice"] .grabber'),
            premiumSliderTrack: control.$('[slider-model="filters.maxPrice"] > span'),
            deductibleSliderThumb: control.$('[slider-model="filters.maxDeductible"] .grabber'),
            deductibleSliderTrack: control.$('[slider-model="filters.maxDeductible"] > span'),
            carriersPane: control.$('.panel-primary-inner .fa-shopping-cart.fa-caret-right'),
            carriers: control.all(by.binding('carrier.name'))
        }

        ////// Premium ///////

        self.expandPriceFilter = function () {
            return controls.pricePane.click();
        }

        self.movePremiumSlider = function (percentOffsetFromCurrentPosition) {
            return moveSlider(controls.premiumSliderTrack, controls.premiumSliderThumb, percentOffsetFromCurrentPosition);
        }

        self.moveDeductibleSlider = function (percentOffsetFromCurrentPosition) {
            return moveSlider(controls.deductibleSliderTrack, controls.deductibleSliderThumb, percentOffsetFromCurrentPosition);
        };

        var moveSlider = function (track, thumb, percentOffsetFromCurrentPosition) {
            return track
                .getCssValue("width")
                .then(function (widthRaw) {
                    var width = Number(widthRaw.replace("px", ""));
                    var dx = Number(percentOffsetFromCurrentPosition / 100.0 * width);
                    return browser.actions().mouseMove(thumb, {
                        x: dx,
                        y: 0
                    }).click().perform();
                })
                .then(function () {
                    return browser.sleep(10000); // wait for page to update.
                });
        }


        //////// Carriers /////////

        self.expandCarriersFilter = function () {
            return controls.carriersPane.click();
        }

        self.clickCarrierFilter = function (namePattern) {
            return controls.carriers
                .map(function (x) {
                    return x.getText();
                }).filter(function (x) {
                    return x.match(namePattern);
                }).spread(function (x) {
                    return x.click();
                }).then(function () {
                    return browser.sleep(5000);
                });
        }

        self.maxPremium = function () {
            return controls.premium.getText().then(function (price) {
                return price.trimCurrency();
            })
        };

        self.maxDeductible = function () {
            return controls.deductible.getText().then(function (price) {
                return price.trimCurrency();
            })
        };

        Promise.prototype.browserSleep = function (s) {
            return browser.sleep(s).return(this);
        }

    }

})();