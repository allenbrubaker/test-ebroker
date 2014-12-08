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
        maxPremiumSliderThumb: $('[slider-model="filters.maxPrice"] .grabber'),
        maxPremiumSliderTrack: $('[slider-model="filters.maxPrice"] > span'),
        maxDeductibleSliderThumb: $('[slider-model="filters.maxDeductible"] .grabber'),
        maxDeductibleSliderTrack: $('[slider-model="filters.maxDeductible"] > span'),
        carriersPane: $('.panel-primary-inner .fa-shopping-cart'),
    },
    plans: element.all(by.repeater('plan in plans'))
}