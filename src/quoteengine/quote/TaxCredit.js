(function(){
    module.exports = TaxCredit;
    
    function TaxCredit(){
        var self = this;
        var controls = {
            premiumsWithTaxCredit: controls.all(by.binding('plan.deductiblePrice')),
            taxCredit: controls.element(by.css('.label-success.label-xlb')),
            premiumsWithoutTaxCredit: controls.all(by.css('.oswald.small-premium.slashed'))
        };
    };
    
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
            for(int i = 0; i < result.creditedPremium.length; i++){
                return taxCredit == result.uncreditedPremium[i] - result.creditedPremium[i];
            }
        });
    }
    
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
    
})();