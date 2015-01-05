(function () {

    module.exports = Application

    var Login = require('./Login')

    function Application() {
        var self = this;
        var controls = {
            saveMenu: $('.fa-cog'),
            saveApplicationAndLogout: $('[ng-click^="saveApplication(true, true)"]'),
            savedApplications: $$('[ng-repeat^="application in applications"]')
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
    }
})()