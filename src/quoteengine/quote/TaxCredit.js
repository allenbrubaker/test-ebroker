(function(){
    module.exports = TaxCredit;
    var Home = require('../home/Home');
    function TaxCredit(){
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
    
    var value = function(item){
    return function(){
        return Promise.resolve(item
            .map(function(control){
                return control.getText().then(function(x){
                    return x.trimCurrency();
                });
            }));
    }
    }
    
    self.load = function(){
        browser.get('/');
        Home.clearZip();
    }
    
    self.premiumsWithoutTaxCredit = value(controls.premiumsWithoutTaxCredit);
        
    self.taxCredit = function(){
        return controls.taxCredit.getText().then(function(x){
            return x.trimCurrency();
        });
    }
    
    self.premiumsWithTaxCredit = value(controls.premiumsWithTaxCredit);
    
    self.isCorrectPremium = function(){
        Promise.props({
            creditedPremium: self.premiumsWithTaxCredit(),
            uncreditedPremium: self.premiumsWithoutTaxCredit(),
        }).then(function(result){
            for(i = 0; i < result.creditedPremium.length; i++){
                return taxCredit == result.uncreditedPremium[i] - result.creditedPremium[i];
            }
        });
    }
    
        
        self.clickFindOutHow = function(){
            return controls.findOutHowButton.click().sleep(1000);
        }
        
        self.clickCancel = function(){
            return controls.cancelButton.click().sleep(1000);
        }
        
        self.clickTaxEstimator = function(){
            return controls.taxtEstimatorNextButton.click().sleep(1000);
        }
        
        self.clickHouseholdCoverage = function(){
            return controls.householdCoverageButton.click().sleep(1000);
        }
        
        self.enterIncome = function(income){
            return controls.incomeInput.sendKeys(income);
        }
        
        self.clickIncomeNext = function(){
            return controls.incomeNextButton.click().sleep(1000);
        }
        
        self.enterHouseholdSize = function(size){
            return controls.householdSize.sendKeys(size);
        }
        
        self.clickHouseholdNext = function(){
            return controls.householdNextButton.click().sleep(1000);
        }
        
        self.clickForTaxCredit = function(){
            return controls.taxCreditContinueButton.click().sleep(1000);
        }
        
        self.computeTaxCredit = function(){
            self.clickFindOutHow();
            self.clickTaxEstimator();
            self.clickHouseholdCoverage();
            self.enterIncome("40000");
            self.clickIncomeNext();
            self.enterHouseholdSize("4");
            browser.sleep(1000);
            self.clickHouseholdNext();
            browser.sleep(3000);
            self.clickForTaxCredit();
            browser.sleep(3000);
            return self.taxCredit() == '28.67';
        }
};  
})();