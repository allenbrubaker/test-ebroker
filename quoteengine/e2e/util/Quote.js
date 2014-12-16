(function () {

    var Home = require('./Home');

    module.exports = Quote;

    function Quote() {
        var self = this;

        var controls = {
            modalClose: $('.modal-dialog [ng-click ^= cancel]'),
            plans: element.all(by.repeater('plan in plans')),
            filter: $('[ng-controller = filterController'),
        }

        self.plans = function () {
            var plans = controls.plans.map(function (control) {
                return new Plan(control);
            });
            return Promise.resolve(plans);
        }

        self.filter = new Filter(controls.filter);

        self.sort = new Sort();

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

        self.assertPremiumsAtMostFilter = function () {
            return self.filter.maxPremium().then(function (max) {
                return self.plans().each(function (plan) {
                    plan.premium().should.eventually.be.at.most(max);
                })
            })
        }

        self.assertDeductiblesAtMostFilter = function () {
            return self.filter.maxDeductible().then(function (max) {
                self.plans().each(function (plan) {
                    plan.deductible().should.eventually.be.at.most(max);
                })
            })
        }

        self.allCarriersNotDisplaying = function (logoName) {
            return self.allPlans(function (plan) {
                return plan.carrier().then(function (carrier) {
                    return carrier.toLowerCase() != logoName.toLowerCase();
                });
            });
        }

        self.allMetalTypesNotDisplaying = function (metalType) {
            return self.allPlans(function (plan) {
                return plan.metal().then(function (x) {
                    return x.toLowerCase() != metalType.toLowerCase();
                });
            });
        }

        self.allHsaEligible = function () {
            return self.allPlans(function (plan) {
                return plan.isHsaEligible();
            });
        }



        self.allPlans = function (predicate) {
            return self.plans().reduce(function (acc, plan) {
                if (!acc) return false;
                return predicate(plan).then(function (satisfies) {
                    return acc && satisfies;
                });
            }, true);
        }

        self.somePlans = function (predicate) {
            return self.plans().reduce(function (acc, plan) {
                if (acc) return true;
                return predicate(plan).then(function (satisfies) {
                    return acc || satisfies;
                })
            }, false)
        }


        // direction: ascending: true, descending: false
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
    }

    function Plan(control) {
        var self = this;

        var controls = {
            name: control.element(by.binding('plan.display_name')),
            deductible: control.element(by.binding('plan.deductible')),
            premium: control.element(by.binding('plan.premium')),
            hsaEligible: control.element(by.css('[ng-show ^= "plan.hsa_eligible"] .fa-times.ng-hide')),
            carrier: control.element(by.css('.quote-logo img')),
            metalLevel: control.element(by.binding('plan.metal_level')),
            compare: control.element(by.css('.compare-tick')),
            select: control.element(by.css('a[ui-sref ^= "quote.cart"]')),
            showMore: control.element(by.css('.fa-info-circle')),
            planInfo: control.element(by.css('[ng-click ^= moreInfo]')),
            modal: $('.modal') 
        }

        self.name = function () {
            return controls.name.getText();
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
            return controls.hsaEligible.isPresent();
        };

        self.carrier = function () {
            return controls.carrier.getAttribute('src').then(function (s) {
                return s.match(/.*\/(.*)\.(jpg|gif|png)/i)[0].replace('logo', '');
            });
        };

        self.metal = function () {
            return controls.metalLevel.getText();
        };

        self.clickCompare = function () {
            return controls.compare.click();
        }

        self.selectPlan = function () {
            return controls.select.click();
        }

        self.showMore = function () {
            return controls.showMore.click();
        }

        self.showPlanInfo = function () {
            return controls.planInfo.click().sleep(4000);
        }

        self.planInfo = new PlanInfo(controls.modal);
    }

    function PlanInfo(control) {
            var controls = {
                name: control.element(by.binding('plan.display_name')),
                premium: control.element(by.binding('plan.premium'))
            }

            this.premium = function () {
                return controls.premium
                    .getText().then(function (x) {
                        return x.trimCurrency();
                    });
            }

            this.name = function () {
                return controls.name.getText();
            }
        };
    
    function Filter(control) {
        var self = this;

        var controls = {
            pricePane: control.$('.panel-primary-inner .fa-dollar + .fa-caret-right'),
            premium: control.element(by.binding('filters.maxPrice')),
            deductible: control.element(by.binding('filters.maxDeductible')),
            premiumSliderThumb: control.$('[slider-model="filters.maxPrice"] .grabber'),
            premiumSliderTrack: control.$('[slider-model="filters.maxPrice"]'),
            deductibleSliderThumb: control.$('[slider-model="filters.maxDeductible"] .grabber'),
            deductibleSliderTrack: control.$('[slider-model="filters.maxDeductible"]'),
            carriersPane: control.$('.panel-primary-inner .fa-shopping-cart + .fa-caret-right'),
            carriers: control.all(by.binding('carrier.name')),
            planTypePane: control.$('.panel-primary-inner .fa-eye + .fa-caret-right'),
            showOnlyHsa: control.$('[ng-click ^= showHSA]'),
            metalTypePane: control.$('.panel-primary-inner .fa-shield + .fa-caret-right'),
            metalTypes: control.all(by.binding('metal.name')),
            sortButton: control.element(by.css('.btn-orange-sm.dropdown-toggle')),
            sortPriceDesc: control.element(by.css('[ng-click *= premium][ng-click *= desc]')),
            sortPriceAsc: control.element(by.css('[ng-click *= premium][ng-click *= asc]')),
            sortDeductibleDesc: control.element(by.css('[ng-click *= deductible][ng-click *= desc]')),
            sortDeductibleAsc: control.element(by.css('[ng-click *= deductible][ng-click *= asc]'))

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
                    return browser.sleep(5000); // wait for page to update.
                });
        }


        //////// Carriers /////////

        self.expandCarrierFilter = function () {
            return controls.carriersPane.click();
        }

        self.clickCarrier = function (namePattern) {
            return Promise.resolve(controls.carriers
                .map(function (control) {
                    return {
                        control: control,
                        carrier: control.getText()
                    };
                })).filter(function (x) {
                return x.carrier.match(namePattern);
            }).spread(function (x) {
                return x.control.click();
            }).then(function () {
                return browser.sleep(8000);
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

        ////////// Plan Type ///////////

        self.expandPlanTypeFilter = function () {
            return controls.planTypePane.click();
        }

        self.clickShowOnlyHsa = function () {
            return controls.showOnlyHsa.click().sleep(4000);
        }

        /////////// Metal Type //////////

        self.expandMetalTypeFilter = function () {
            return controls.metalTypePane.click();
        }

        self.clickMetalType = function (namePattern) {
            return Promise.resolve(controls.metalTypes
                .map(function (control) {
                    return {
                        control: control,
                        metalType: control.getText()
                    };
                })).filter(function (x) {
                return x.metalType.match(namePattern);
            }).spread(function (x) {
                return x.control.click();
            }).then(function () {
                return browser.sleep(6000);
            });
        }


    }


    function Sort(control) {
        var self = this;

        var controls = {
            sortButton: $('.btn-orange-sm.dropdown-toggle'),
            sortPriceDesc: $('[ng-click *= premium][ng-click *= desc]'),
            sortPriceAsc: $('[ng-click *= premium][ng-click *= asc]'),
            sortDeductibleDesc: $('[ng-click *= deductible][ng-click *= desc]'),
            sortDeductibleAsc: $('[ng-click *= deductible][ng-click *= asc]')
        }

        self.sortPremium = function (isAscending) {
            return controls.sortButton.click()
                .then(function () {
                    return isAscending ? controls.sortPriceAsc.click() : controls.sortPriceDesc.click();
                }).sleep(4000);
        }

        self.sortDeductible = function (isAscending) {
            return controls.sortButton.click()
                .then(function () {
                    return isAscending ? controls.sortDeductibleAsc.click() : controls.sortDeductibleDesc.click();
                }).sleep(4000);
        }

    }

})();