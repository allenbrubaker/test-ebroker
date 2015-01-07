(function () {
    
    module.exports = Home;

    var Location = require('../quote/Location')
    var Dependents = require('../quote/Dependents')

    function Home() {
        var self = this;

        var controls = {
            quote: $('a[ng-click ^= toQuote]'),
            dependentsContainer: $('[ng-form=quoteBoxForm]')
        }
        
        self.location = new Location();
        self.dependents = new Dependents(controls.dependentsContainer);

        self.load = function () {
            return browser.get('/').sleep(3000).then(self.location.clearZip);
        }

        self.quote = function () {
            return controls.quote.click()
        }
    }

    Home.login = function(zip) {
        zip = zip || '17012';
        var home = new Home();
        return home.load()
        .then(function () { return home.location.enterZip(zip) })
        .then(function() { return home.dependents.addSelf(true, '07/06/1986', false) })
        .then(home.quote)
		.sleep(7000)
    }

})();
