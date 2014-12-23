(function () {
    module.exports = Dependents

    function Dependents(control) {
        var self = this

        control = $('.modal-dialog');
        var controls = {
            dependentsPane: $('.panel-primary-inner .fa-users + .fa-caret-right'),
            editDependents: $('[href*="quote/subsidy?step=dependents"]'),
            dependents: control.all(by.repeater('dependent in dependents')),
            addDependent: control.$('a[ng-click ^= addDependent]'),
            remove: control.all(by.css('[ng-click^=removeDependent]')),
            closeModal: control.$('[ng-click^=ok]'),
            quote: $('a[ng-click ^= toQuote]'),
            
        }

        self.load = function () {
            browser.get('/')
            self.clearZip()
        }

        self.expandPane = function () {
            return controls.dependentsPane.isPresent().then(function (visible) {
                return visible ? controls.dependentsPane.click().sleep(1000) : null
            })
        }

        self.edit = function () {
            return controls.editDependents.click().sleep(2000)
        }

        self.addSelf = function (isMale, dob, isTobaccoUse) {
            return addDependent('You', isMale, dob, isTobaccoUse)
        }

        self.addSpouse = function (isMale, dob, isTobaccoUse) {
            return addDependent('Spouse', isMale, dob, isTobaccoUse)
        }

        self.addChild = function (isMale, dob, isTobaccoUse) {
            return addDependent('Child', isMale, dob, isTobaccoUse)
        }

        self.removeDependent = function (index) {
            return controls.dependents.count().then(function (c) {
                if (index == null)
                    index = c - 1;
                if (index == 0)
                    return // cannot remove self dependent.
                return controls.remove.get(index).click().sleep(1000)
            })
        }

        self.assertDependentsCount = function (count) {
            return controls.dependents.count().should.eventually.equal(count)
        }

        function addDependent(relationship, isMale, dob, isTobaccoUse) {
            return controls.dependents.count().then(function (count) {
                if (!relationship.match(/you/i)) {
                    controls.addDependent.click().sleep(1000)
                    ++count
                }
                var control = controls.dependents.get(count - 1)
                return new Dependent(control, relationship, isMale, dob, isTobaccoUse)
            })
        }

        self.quote = function () {
            return controls.quote.click()
        }

        self.closeModal = function () {
            return controls.closeModal.click().sleep(5000);
        }
    }

    function Dependent(control, relationship, isMale, dob, isTobaccoUse) {
        this.controls = new(function () {
            this.relations = control.all(by.css('[ng-options *= getRelationships] option'))
            this.child = this.relations.get(1)
            this.spouse = this.relations.get(2)
            this.male = control.$('.fa-male')
            this.female = control.$('.fa-female')
            this.dob = control.element(by.model('dependent.dob'))
            this.tobacco = control.$('.fa-check')
            this.noTobacco = control.$('.fa-ban')
        })

        this.relationship = relationship
        this.isMale = isMale == null ? true : isMale
        this.dob = dob || ''
        this.isTobaccoUse = isTobaccoUse == null ? false : isTobaccoUse
    }

    Dependent.prototype = {
        get relationship() {
            return this._relationship
        },
        set relationship(r) {
            this._relationship = r
            if (r.match(/child/i))
                this.controls.child.click()
            else if (r.match(/spouse/i))
                this.controls.spouse.click()
        },
        get isMale() {
            return this._isMale
        },
        set isMale(m) {
            this._isMale = m
            if (m)
                this.controls.male.click()
            else
                this.controls.female.click()
        },
        get dob() {
            return this._dob
        },
        set dob(d) {
            this._dob = d
            this.controls.dob.clear();
            this.controls.dob.sendKeys(d);
        },
        get isTobaccoUse() {
            return this._isTobaccoUse
        },
        set isTobaccoUse(t) {
            this._isTobaccoUse = t
            if (t)
                this.controls.tobacco.click()
            else
                this.controls.noTobacco.click()
        }
    }

})()