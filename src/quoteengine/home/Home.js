(function () {
    module.exports = Home;

    function Home() {
        var self = this;

        var controls = {
            zip: element(by.model('$root.zipcode')),
            counties: element(by.model('$root.county')).all(by.css('option')),
            addDependent: element(by.css('a[ng-click ^= addDependent]')),
            quote: element(by.css('a[ng-click ^= toQuote]')),
            dependents: element.all(by.repeater('dependent in dependents')),
            locationPane: $('.panel-primary-inner .fa-globe'),
            editLocation: $('[ng-click^=locationUpdate]')
        }

        self.load = function () {
            browser.get('/');
            self.clearZip();
        }

        self.expandLocationPane = function() { return controls.locationPane.click() }
        self.editLocation = function() { return controls.editLocation.click().sleep(1500)}
        
        
        //////// Zip ////////

        self.clearZip = function () {
            return controls.zip.clear();
        }

        self.enterZip = function (zip) {
            return controls.zip.sendKeys(zip).sleep(4000);
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

        ///// Dependents //////

        self.dependents = [];

        self.addSelf = function(isMale, dob, isTobaccoUse) {
            addDependent('You', isMale, dob, isTobaccoUse);
        }

        self.addSpouse = function (isMale, dob, isTobaccoUse) {
            addDependent('Spouse', isMale, dob, isTobaccoUse);
        }

        self.addChild = function (isMale, dob, isTobaccoUse) {
            addDependent('Child', isMale, dob, isTobaccoUse);
        }

        self.removeDependent = function (index) {
            if (index == null)
                index = self.dependents.length - 1;
            if (index == 0)
                return; // cannot remove self dependent.
            self.dependents[index].remove();
            self.dependents.splice(index, 1);
        }

        self.assertDependentsCount = function (count) {
            controls.dependents.count().should.eventually.equal(count);
            self.dependents.length.should.equal(count);
        }

        function addDependent(relationship, isMale, dob, isTobaccoUse) {
            if (self.dependents.length == 0)
                relationship = 'You';
            else
                controls.addDependent.click();
            var control = dependentControl(self.dependents.length);
            var dependent = new Dependent(control, relationship, isMale, dob, isTobaccoUse);
            self.dependents.push(dependent);
            return dependent;
        }

        function dependentControl(index) {
            index = index || 0;
            return controls.dependents.get(index);
        }

        ////// Quote //////
        self.quote = function () {
            controls.quote.click();
        }
    }

    Home.login = function(zip) {
        zip = zip || '17012';
        var home = new Home();
        home.load();
        home.enterZip(zip);
        home.addSelf(true, '07/06/1986', false);
        home.quote();
    }

    function Dependent(control, relationship, isMale, dob, isTobaccoUse) {
        this.controls = new(function () {
            this.relations = control.all(by.css('[ng-options *= getRelationships] option'));
            this.child = this.relations.get(1);
            this.spouse = this.relations.get(2);
            this.male = control.element(by.css('.fa-male'));
            this.female = control.element(by.css('.fa-female'));
            this.dob = control.element(by.model('dependent.dob'));
            this.tobacco = control.element(by.css('.fa-check'));
            this.noTobacco = control.element(by.css('.fa-ban'));
            this.remove = control.element(by.css('.fa-times'));
        });

        this.relationship = relationship;
        this.isMale = isMale == null ? true : isMale;
        this.dob = dob || '';
        this.isTobaccoUse = isTobaccoUse == null ? false : isTobaccoUse;

    }

    Dependent.prototype = {
        get relationship() {
            return this._relationship;
        },
        set relationship(r) {
            this._relationship = r;
            if (r.match(/child/i))
                this.controls.child.click();
            else if (r.match(/spouse/i))
                this.controls.spouse.click();
        },
        get isMale() {
            return this._isMale;
        },
        set isMale(m) {
            this._isMale = m;
            if (m)
                this.controls.male.click()
            else
                this.controls.female.click();
        },
        get dob() {
            return this._dob;
        },
        set dob(d) {
            this._dob = d;
            this.controls.dob.sendKeys(d);
        },
        get isTobaccoUse() {
            return this._isTobaccoUse;
        },
        set isTobaccoUse(t) {
            this._isTobaccoUse = t;
            if (t)
                this.controls.tobacco.click();
            else
                this.controls.noTobacco.click();
        },
        remove: function () {
            this.controls.remove.click();
        }
    }

})();
