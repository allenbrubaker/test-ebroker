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
            browser.get('/');
            self.location.clearZip();
        }

        self.quote = function () {
            return controls.quote.click()
        }
    }

    Home.login = function(zip) {
        zip = zip || '17012';
        var home = new Home();
        home.load();
        home.location.enterZip(zip);
        home.dependents.addSelf(true, '07/06/1986', false);
        home.quote();
    }

})();
