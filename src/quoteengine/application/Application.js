(function () {

    module.exports = Application

    var Login = require('./Login')

    function Application() {
        var self = this;
        var controls = {
            saveMenu: $('.fa-cog'),
            saveApplicationAndLogout: $('[ng-click^="saveApplication(true, true)"]'),
            savedApplications: $$('[ng-repeat^="application in applications"]'),
            comparisonName: $('.modal-dialog [ng-model^=comparisonName]'),
            saveDialog: $('.modal-dialog .btn-success'),
            comparisons: $$('[ng-repeat^="compare in comparisons"]'),
            quotes: $$('[ng-repeat^="quote in quotes"]')
        }

        self.saveApplicationAndLogout = function () {
            return controls.saveMenu.click().sleep(2000).then(controls.saveApplicationAndLogout.click).sleep(5000)
        }

        var login = new Login()
        self.login = login.login
        self.register = login.register

        self.isAppSavedToday = function () {
            return controls.savedApplications.getText().then(function (text) {
                var d = new Date();
                var dd = d.getDate() + ', ' + d.getFullYear()
                return new RegExp(dd).exec(text) != null
            })
        }

        self.comparisons = function () {
            return Promise.resolve(controls.comparisons.map(function (c) {
                return new Comparison(c)
            }))
        }

        self.quotes = function () {
            return Promise.resolve(controls.quotes.map(function (q) {
                return new Quote(q)
            }))
        }

        self.openFirstComparison = function () {
            return self.comparisons().first().call('open')
        }

        self.saveComparison = function (name) {
            name = name || 'Comparison'
            return controls.comparisonName.sendKeys(name).then(controls.saveDialog.click).sleep(6000)
        }

        self.saveQuote = function () {
            return controls.saveDialog.click().sleep(8000) //4000
        }
    }

    function Comparison(control) {
        var self = this
        var controls = {
            viewCurrentComparison: control.$('.btn-success')
        }

        self.open = function () {
            return controls.viewCurrentComparison.getAttribute('href').then(function (link) {
                    return browser.get(link)
                }).sleep(10000) // resist clicking button because it opens new browser window.
        }
    }

    function Quote(control) {
        var self = this
        var controls = {
            plans: control.$('.dropdown')
        }

        self.isContainPlan = function (name, premium) {
            return controls.plans.click().then(controls.plans.getText).then(function (text) {
                return RegExp(escapeRegex(name), 'i').exec(text) != null 
                && RegExp(escapeRegex(premium), 'i').exec(text) != null
            })
        }

        function escapeRegex(str) {
            return str.toString().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }
    }
})()