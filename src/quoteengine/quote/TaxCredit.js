(function () {
    module.exports = TaxCredit;

    function TaxCredit() {
        var self = this;
        var controls = {
            premiumsWithTaxCredit: element.all(by.binding('plan.deductiblePrice')),
            taxCredit: element(by.css('.label-success.label-xlg')),
            premiumsWithoutTaxCredit: element.all(by.css('.oswald.small-premium.slashed')),
            findOutHowButton: element(by.css('.btn-warning[ui-sref ^="quote.subsidy"]')),
            taxtEstimatorNextButton: element(by.css('.btn-primary[ng-click ^= next]')),
            householdCoverageButton: element(by.css('.ng-pristine[ng-model ^= employerHealth][ng-click ^= change]')),
            incomeInput: element(by.css('.input-xlg')),
            incomeNextButton: element(by.css('.btn-primary[ng-click ^= next]')),
            householdSize: element(by.css('.input-xlg[ng-model *= householdSize]')),
            householdNextButton: element(by.css('.btn-primary[ng-click ^= next]')),
            taxCreditContinueButton: element(by.css('.btn[ng-click ^= addDependentSession]')),
        };

        var value = function (item) {
            return function () {
                return Promise.resolve(item
                    .map(function (control) {
                        return control.getText().then(function (x) {
                            return x.trimCurrency();
                        });
                    }));
            }
        }
        
        self.premiumsWithoutTaxCredit = value(controls.premiumsWithoutTaxCredit);
        self.premiumsWithTaxCredit = value(controls.premiumsWithTaxCredit);

        var taxCredit = function () {
            return controls.taxCredit.getText().then(function (x) {
                return x.trimCurrency();
            });
        }

        self.isCorrectPremium = function () {
            return taxCredit().then(function (taxCredit) {

                return Promise.zip(self.premiumsWithoutTaxCredit(), self.premiumsWithTaxCredit())
                    .every(function (result) {
                        return Math.abs(taxCredit - (result[0] - result[1])) < 1e-6;
                    });
            });
        }
        
        self.computeTaxCredit = function () {
            controls.findOutHowButton.click().sleep(1000)
            controls.taxtEstimatorNextButton.click().sleep(1000);
            controls.householdCoverageButton.click().sleep(1000);
            controls.incomeInput.sendKeys('40000')
            controls.incomeNextButton.click().sleep(1000);
            controls.householdSize.sendKeys('4').sleep(1000);
            controls.householdNextButton.click().sleep(4000)
            controls.taxCreditContinueButton.click().sleep(4000)
            return taxCredit() == '28.67';
        }

        

    };

})();