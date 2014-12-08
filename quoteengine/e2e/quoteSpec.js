var util = require('./util/util');
var controls = require('./util/controls');
var home = controls.home;
var quote = controls.quote;
var constants = require('./util/constants');

describe('quote:', function () {
    this.timeout(99999);
    loadQuotePage();

    describe('filters:', function () {

        it('all plans shown contain premiums at most max premium', function (done) {
            quote.filters.pricePane.click();

            quote.filters.maxPremiumSliderTrack.getCssValue("width").then(function (s) {
                var width = Number(s.replace("px", ""));
                var dx = Number(.2 * width);

                premiumsAreAtMostMax();
                for (var i = 0; i < 1; ++i) {
                    browser.actions().dragAndDrop(quote.filters.maxPremiumSliderThumb, {
                        x: -dx,
                        y: 0
                    }).perform();
                    sleep(4);
                    premiumsAreAtMostMax();
                }
                browser.actions().dragAndDrop(quote.filters.maxPremiumSliderThumb, {
                    x: dx * 1.1,
                    y: 0
                }).perform();
                sleep(4);

                function premiumsAreAtMostMax() {
                    element(by.binding('filters.maxPrice')).getText().then(function (x) {
                        var maxPrice = x.trimCurrency();
                        element.all(by.binding('plan.premium')).each(function (x) {
                            x.getText().then(function (raw) {
                                var premium = raw.trimCurrency();
                                premium.should.be.at.most(maxPrice);
                            })
                        });
                    });
                }
            });

        });

        it('all plans shown contain deductibles at most max deductible', function (done) {
            quote.filters.maxDeductibleSliderTrack.getCssValue("width").then(function (s) {
                var width = Number(s.replace("px", ""));
                var dx = Number(.3 * width);

                deductiblesAreAtMostMax();
                for (var i = 0; i < 1; ++i) {
                    browser.actions().dragAndDrop(quote.filters.maxDeductibleSliderThumb, {
                        x: -dx,
                        y: 0
                    }).perform();
                    sleep(4);
                    deductiblesAreAtMostMax();
                }
                browser.actions().dragAndDrop(quote.filters.maxDeductibleSliderThumb, {
                    x: dx * 1.1,
                    y: 0
                }).perform();
                sleep(4);

                function deductiblesAreAtMostMax() {
                    element(by.binding('filters.maxDeductible')).getText().then(function (x) {
                        var maxPrice = x.trimCurrency();
                        element.all(by.binding('plan.deductible')).each(function (x) {
                            x.getText().then(function (raw) {
                                var deductible = raw.trimCurrency();
                                deductible.should.be.at.most(maxPrice);
                            })
                        });
                    });
                }
            });
        });

        it.only('carriers filter functions correctly', function () {
            quote.filters.carriersPane.click();

            element.all(by.binding('carrier.name')).each(function (x) {
                x.getText().then(function (t) {
                    if (t.match(/healthamericaone/i))
                        x.click();
                });
            });
            sleep(5);
            carrierNamesNotDisplaying('healthamericaone');

            function carrierNamesNotDisplaying(logoName) {
                var count = quote.plans.all(by.css('.quote-logo img[src*="' + logoName + '"]')).count();
                count.should.eventually.equal(0);
            }
        })
    });



    function loadQuotePage() {
        browser.driver.manage().window().maximize(); // needed for sliders to function correctly.
        util.go();
        home.zip.sendKeys(constants.zipWithSingleCounty);
        home.dependents.get(0).element(by.model('dependent.dob')).sendKeys(constants.dob);
        home.quoteBtn.click();
        quote.modalClose.click();
        browser.ignoreSynchronization = true;
        sleep(4);
    };


    function sleep(s) {
        browser.sleep(s * 1000);
    }


});