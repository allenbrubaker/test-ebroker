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
            saveComparison: $('.modal-dialog .btn-success'),
            comparisons: $$('[ng-repeat^="compare in comparisons"]'),
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

        self.openFirstComparison = function () {
            return self.comparisons().first().call('open')
        }

        self.saveComparison = function (name) {
            name = name || 'Comparison'
            return controls.comparisonName.sendKeys(name).then(controls.saveComparison.click).sleep(6000)
        }
    }

    function Comparison(control) {
        var self = this;
        var controls = {
            viewCurrentComparison: control.$('.btn-success')
        }

        self.open = function () {
            return controls.viewCurrentComparison.getAttribute('href').then(function(link) { return browser.get(link)}).sleep(10000) // resist clicking button because it opens new browser window.
        }
    }
})()