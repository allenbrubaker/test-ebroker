module.exports = Plan

var Cart = require('./Cart')

function Plan(control) {
        var self = this

        var controls = {
            name: control.element(by.binding('plan.display_name')),
            deductible: control.element(by.binding('plan.deductible')),
            premium: control.element(by.binding('plan.premium')),
            hsaEligible: control.$('[ng-show ^= "plan.hsa_eligible"] .fa-times.ng-hide'),
            carrier: control.$('.quote-logo img'),
            metalLevel: control.element(by.binding('plan.metal_level')),
            compare: control.$('.compare-tick i'),
            select: control.$('a[ui-sref ^= "quote.cart"]'),
            showMore: control.$('.fa-info-circle'),
            planInfo: control.$('[ng-click ^= moreInfo]'),
            modal: $('.modal')
        }

        self.name = function () {
            return controls.name.getText()
        }

        self.deductible = function () {
            return controls.deductible
                .getText().then(function (x) {
                    return x.trimCurrency()
                })
        }

        self.premium = function () {
            return controls.premium
                .getText().then(function (x) {
                    return x.trimCurrency()
                })
        }

        self.isHsaEligible = function () {
            return controls.hsaEligible.isPresent()
        }

        self.carrier = function () {
            return controls.carrier.getAttribute('src').then(function (s) {
                return s.match(/.*\/(.*)\.(jpg|gif|png)/i)[0].replace('logo', '')
            })
        }

        self.metal = function () {
            return controls.metalLevel.getText()
        }

        self.clickCompare = function () {
            return controls.compare.click().sleep(1000)
        }

        self.select = function () {
            return controls.select.click().sleep(5000);
        }

        self.showMore = function () {
            return controls.showMore.click().sleep(1000);
        }

        self.showPlanInfo = function () {
            return controls.planInfo.click().sleep(4000)
        }

        self.planInfo = new Cart(controls.modal, 'info')
    }
