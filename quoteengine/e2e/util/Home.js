(function () {
    var util = require('./util');
    module.exports = Home;

    function Home() {
        var self = this;

        var controls = {
            zip: element(by.model('$root.zipcode')),
            counties: element(by.model('$root.county')).all(by.css('option')),
            addDependentBtn: element(by.css('a[ng-click ^= addDependent]')),
            quoteBtn: element(by.css('a[ng-click ^= toQuote]')),
            dependents: element.all(by.repeater('dependent in dependents')),
        }

        self.load = function () {
            util.go();
        }


        //////// Zip ////////

        self.clearZip = function () {
            return controls.zip.clear();
        }

        self.enterZip = function (zip) {
            return controls.zip.sendKeys(zip);
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
            index = index || 0;
            return controls.counties.get(Math.max(index - 1, 0))
        }

        ///// Dependents //////


        self.dependents = [];

        addDependent(); // add self by default.

        self.self = self.dependents[0];

        self.addSpouse = function (isMale, dob, isTobaccoUse) {
            addDependent('Spouse', isMale, dob, isTobaccoUse);
        }

        self.addChild = function (isMale, dob, isTobaccoUse) {
            addDependent('Child', isMale, dob, isTobaccoUse);
        }

        self.removeDependent = function (index) {
            if (index == 0)
                return; // cannot remove self dependent.
            self.dependents[index].remove();
            self.dependents.splice(index, 1);
        }

        self.assertDependentsCount = function (count) {
            controls.dependents.count().should.eventually.equal(count);
            self.dependents.should.have.length.equal(count);
        }

        function addDependent(relationship, isMale, dob, isTobaccoUse) {
            if (self.dependents.length == 0)
                relationship = 'You';
            else
                controls.addDependentBtn.click();
            self.dependents.push(new Dependent(dependentControl(self.dependents.length), relationship, isMale, dob, isTobaccoUse));
        }

        function dependentControl(index) {
            index = index || 0;
            return controls.dependents.get(index);
        }

        ////// Quote //////
        self.quote = function () {
            controls.quoteBtn.click();
        }
    }

    function Dependent(control, relationship, isMale, dob, isTobaccoUse) {
        this.controls = {
            child: control.all(by.css('[ng-options *= getRelationships] option')).get(1),
            spouse: control.all(by.css('[ng-options *= getRelationships] option')).get(2),
            male: control.element(by.css('.fa-male')),
            female: control.element(by.css('.fa-female')),
            dob: control.element(by.model('dependent.dob')),
            tobacco: control.element(by.css('.fa-check')),
            noTobacco: control.element(by.css('.fa-ban')),
            remove: control.element(by.css('.fa-times'))
        }

        this.relationship = relationship;
        this.isMale = isMale == null ? true : isMale;
        this.dob = dob || '';
        this.isTobaccoUse = isTobaccoUse == null ? false : isTobaccoUse;

        this.prototype = {
            get relationship() {
                return this._relationship;
            },
            set relationship(r) {
                this._relationship = r;
                this.controls.relations.count().should.eventually.be.above(0);
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
    }


})();