exports.home = {
    zip: element(by.model('$root.zipcode')),
    counties: element(by.model('$root.county')).all(by.css('option')),
    selectedCounty: element(by.model('$root.county')),
     dob: element(by.model('dependent.dob')),
     addDependentBtn: element(by.css('a[ng-click ^= addDependent]')),
     quoteBtn: element(by.css('a[ng-click ^= toQuote]')),
     insuranceTypes: element.all(by.repeater('insurance in $root.insuranceTypes')),
     dependents: element.all(by.repeater('dependent in dependents')),
    
    
};

exports.quote = {
    modal: $('.modal-dialog'),
    modalClose: $('.modal-dialog [ng-click ^= cancel]'),
    filters: {
        pricePane: $('.panel-primary-inner .fa-dollar'),
        carriersPane: $('.panel-primary-inner .fa-shopping-cart'),
    }
}

