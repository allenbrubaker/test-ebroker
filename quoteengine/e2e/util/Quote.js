(function () {

        var q = require('q');
        module.exports = Quote;

        function Quote() {
            self = this;

            var controls = {
                modal: $('.modal-dialog'),
                modalClose: $('.modal-dialog [ng-click ^= cancel]'),
                plans: element.all(by.repeater('plan in plans'))
            }

            self.plans = getPlans();
            self.filter = new Filter();

            function getPlans() {
                var plans = [];
                controls.plans.each(function (planElement) {
                    plans.push(new Plan(planElement));
                })
                return plans;
            };
        }

        function Plan(planElement) {
            self = this;

            planElement.element(by.binding('plan.deductible'))
                .getText().then(function (x) {
                    self.deductible = x.trimCurrency();
                });
            planElement.element(by.binding('plan.premium'))
                .getText().then(function (x) {
                    self.premium = x.trimCurrency();
                });
            planElement.element(by.css('.fa-times.ng-hide[ng-show="plan.hsa_eligible"]'))
                .count().then(function (x) {
                    self.isHsaEligible = x > 0;
                });

            planElement.element(by.css('.quote-logo img')).getCssValue('src').then(function (s) {
                self.carrier = s.match(/.*\/(.+)\.jpg/i)[0].replace('logo', '');
            });

            planElement.element(by.binding('plan.metal_level')).getText().then(function (text) {
                self.metalLevel = text;
            })

            self.clickCompare = function () {
                return planElement.element(by.css('.compare-tick')).click();
            }

            self.selectPlan = function () {
                return planElement.element(by.css('a[ui-sref ^= "quote.cart"]')).click();
            }

        }

        function Filter() {

            var controls = {
                pricePane: $('.panel-primary-inner .fa-dollar.fa-caret-right'),
                premiumSliderThumb: $('[slider-model="filters.maxPrice"] .grabber'),
                premiumSliderTrack: $('[slider-model="filters.maxPrice"] > span'),
                deductibleSliderThumb: $('[slider-model="filters.maxDeductible"] .grabber'),
                deductibleSliderTrack: $('[slider-model="filters.maxDeductible"] > span'),
                carriersPane: $('.panel-primary-inner .fa-shopping-cart.fa-caret-right'),
            }

            self.expandPriceFilter = function () {
                return controls.pricePane.click();
            }

            self.moveDeductibleSlider = function (percentOffsetFromCurrentPosition) {
                return controls.deductibleSliderTrack.getCssValue("width").then(function (s) {
                        var width = Number(s.replace("px", ""));
                        var dx = Number(percentOffsetFromCurrentPosition / 100.0 * width);

                        browser.actions().dragAndDrop(controls.deductibleSliderThumb, {
                            x: -dx,
                            y: 0
                        }).perform();
                    }
                });

            self.movePremiumSlider = function (percentOffsetFromCurrentPosition) {
                return controls.premiumSliderTrack.getCssValue("width").then(function (s) {
                        var width = Number(s.replace("px", ""));
                        var dx = Number(percentOffsetFromCurrentPosition / 100.0 * width);

                        browser.actions().dragAndDrop(controls.premiumSliderThumb, {
                            x: -dx,
                            y: 0
                        }).perform();
                    }
                });

            self.maxPremiumPrice = element(by.binding('filters.maxPrice')).getText();

        }

    }



})();