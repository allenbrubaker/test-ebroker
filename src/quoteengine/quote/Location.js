(function () {
    module.exports = Location;

    function Location() {
        var self = this;

        var controls = {
            zip: element(by.model('$root.zipcode')),
            counties: element(by.model('$root.county')).all(by.css('option')),
            submit: $('[ng-click^=toQuote]')
        }

        self.load = function () {
            browser.get('/');
            self.clearZip();
        }

        self.submit = function() { return controls.submit.click().sleep(5000)}
        
        //////// Zip ////////

        self.clearZip = function () {
            return controls.zip.clear();
        }

        self.enterZip = function (zip) {
            return controls.zip.sendKeys(zip).sleep(5000);
        }


        ////// Counties //////

        self.assertCountyCount = function (count) {
            return controls.counties.count().should.eventually.equal(count + 1); // first entry in select box is 'Select County'
        }

        self.selectCounty = function (index) {
            return countyControl(index).click();
        }

        self.assertCountyName = function (index, namePattern) {
            return countyControl(index).getText().should.eventually.match(namePattern);
        }

        function countyControl(index) {
            index = Math.max(1, (index || 0) + 1); // first index is for 'Select County' initial option.
            return controls.counties.get(index)
        }
    }
})();
