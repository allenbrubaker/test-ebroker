(function () {
    module.exports = Home;

    function Dependents() {
        var self = this;

        var controls = {
            dependentsPane: $('.panel-primary-inner .fa-users'),
            editDependents: $('[ui-sref^="quote.subsidy"]'),
            dependents: element.all(by.repeater('dependent in dependents')),
            addDependent: element(by.css('a[ng-click ^= addDependent]')),
            close: $('[ng-click^=ok]'),
            quote: element(by.css('a[ng-click ^= toQuote]')),
        }

        self.load = function () {
            browser.get('/');
            self.clearZip();
        }

        self.expandDependentsPane = function() { return controls.dependentsPane.click().sleep(1000) }
        self.editDependents = function() { return controls.editDependents.click().sleep(2000)}
        
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
