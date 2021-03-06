module.exports = Filter

function Filter(control) {
    var self = this

    var controls = {
        pricePane: control.$('.panel-primary-inner .fa-dollar + .fa-caret-right'),
        premium: control.element(by.binding('filters.maxPrice')),
        deductible: control.element(by.binding('filters.maxDeductible')),
        premiumSliderThumb: control.$('[slider-model="filters.maxPrice"] .grabber'),
        premiumSliderTrack: control.$('[slider-model="filters.maxPrice"]'),
        deductibleSliderThumb: control.$('[slider-model="filters.maxDeductible"] .grabber'),
        deductibleSliderTrack: control.$('[slider-model="filters.maxDeductible"]'),
        carriersPane: control.$('.panel-primary-inner .fa-shopping-cart + .fa-caret-right'),
        minimizeCarriersPane: control.$('.panel-primary-inner .fa-shopping-cart + .fa-caret-down'),
        carriers: control.all(by.binding('carrier.name')),
        planTypePane: control.$('.panel-primary-inner .fa-eye + .fa-caret-right'),
        showOnlyHsa: control.$('[ng-click ^= showHSA]'),
        marketplacePlans: control.all(by.css('[ng-click^=marketPlaceFilter]')).get(0),
        metalTypePane: control.$('.panel-primary-inner .fa-shield + .fa-caret-right'),
        metalTypes: control.all(by.binding('metal.name')),
        sortButton: control.$('.btn-orange-sm.dropdown-toggle'),
        sortPriceDesc: control.$('[ng-click *= premium][ng-click *= desc]'),
        sortPriceAsc: control.$('[ng-click *= premium][ng-click *= asc]'),
        sortDeductibleDesc: control.$('[ng-click *= deductible][ng-click *= desc]'),
        sortDeductibleAsc: control.$('[ng-click *= deductible][ng-click *= asc]'),
        locationPane: control.$('.panel-primary-inner .fa-globe'),
        editLocation: control.$('[ng-click^=locationUpdate]'),
        dependentsPane: control.$('.panel-primary-inner .fa-users + .fa-caret-right'),
        editDependents: control.$('[href*="quote/subsidy?step=dependents"]'),
		disclaimerPane: control.$('.panel-heading .fa-info-circle + .fa-caret-right'),
		disclaimer: control.$('.panel[is-open=disclaimerOpen]'),
		metalTypeInfo: control.$('.panel[is-open=metalInfo]'),
		metalTypeInfoPane: control.$('.panel[is-open=metalInfo] .panel-heading')
    }

    
    function expandPane(pane) {
        return pane.isPresent().then(function (visible) {
            return visible ? pane.click().sleep(1500) : null
        })
    }
    ////// Location //////

    self.expandLocationPane = function () {
        return expandPane(controls.locationPane)
    }
    self.editLocation = function () {
        return controls.editLocation.click().sleep(2000)
    }

    ////// Dependents /////

    self.expandDependentsPane = function () {
        return expandPane(controls.dependentsPane)
    }

    self.editDependents = function () {
        return controls.editDependents.click().sleep(2000)
    }

    ////// Premium ///////

    self.expandPriceFilter = function () {
        return expandPane(controls.pricePane)
    }

    self.movePremiumSlider = function (percentOffsetFromCurrentPosition) {
        return moveSlider(controls.premiumSliderTrack, controls.premiumSliderThumb, percentOffsetFromCurrentPosition)
    }

    self.moveDeductibleSlider = function (percentOffsetFromCurrentPosition) {
        return moveSlider(controls.deductibleSliderTrack, controls.deductibleSliderThumb, percentOffsetFromCurrentPosition)
    }

    var moveSlider = function (track, thumb, percentOffsetFromCurrentPosition) {
        return track
            .getCssValue("width")
            .then(function (widthRaw) {
                var width = Number(widthRaw.replace("px", ""))
                var dx = Number(percentOffsetFromCurrentPosition / 100.0 * width)
                return browser.actions().mouseMove(thumb, {
                    x: dx,
                    y: 0
                }).click().perform()
            })
            .then(function () {
                return browser.sleep(5000) // wait for page to update.
            })
    }


    //////// Carriers /////////

    self.expandCarrierFilter = function () {
        return expandPane(controls.carriersPane)
    }
    
    self.minimizeCarrierFilter = function () {
        return expandPane(controls.minimizeCarriersPane)
    }

    self.clickCarrier = function (namePattern) {
        return Promise.resolve(controls.carriers
            .map(function (control) {
                return {
                    control: control,
                    carrier: control.getText()
                }
            })).filter(function (x) {
            return x.carrier.match(namePattern)
        }).spread(function (x) {
            return x.control.click()
        }).then(function () {
            return browser.sleep(8000)
        })
    }

    self.maxPremium = function () {
        return controls.premium.getText().then(function (price) {
            return price.trimCurrency()
        })
    }

    self.maxDeductible = function () {
        return controls.deductible.getText().then(function (price) {
            return price.trimCurrency()
        })
    }

    ////////// Plan Type ///////////

    self.expandPlanTypeFilter = function () {
        return expandPane(controls.planTypePane)
    }

    self.clickShowOnlyHsa = function () {
        return controls.showOnlyHsa.click().sleep(5000)
    }

    self.clickMarketplacePlans = function () {
        return controls.marketplacePlans.click().sleep(8000)
    }

    /////////// Metal Type //////////

    self.expandMetalTypeFilter = function () {
        return expandPane(controls.metalTypePane)
    }

    self.clickMetalType = function (namePattern) {
        return Promise.resolve(controls.metalTypes
            .map(function (control) {
                return {
                    control: control,
                    metalType: control.getText()
                }
            })).filter(function (x) {
            return x.metalType.match(namePattern)
        }).spread(function (x) {
            return x.control.click()
        }).then(function () {
            return browser.sleep(6000)
        })
    }
	
	/////////// Disclaimer //////////////
	
	self.expandDisclaimer = function () {
		return expandPane(controls.disclaimerPane)
	}
	
	self.disclaimerText = function () {
		return controls.disclaimer.getText();
	}
	
	//////////// Metal Levels Info /////////////

	self.expandMetalTypeInfo = function () {
		return expandPane(controls.metalTypeInfoPane)
	}

	self.metalTypeInfoText = function () {
		return controls.metalTypeInfo.getText();
	}
}