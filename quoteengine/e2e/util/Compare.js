(function () {

    module.exports = Compare;
    
    function Compare(control) {
        var self = this;

        var controls = {
            names: control.all(by.binding('plan.display_name')),
            premiums: control.all(by.binding('plan.premium'))
        }

        self.premiums = function () {
            return Promise.resolve(controls.premiums
                .map(function (control) {
                    return control.getText().then(function (x) {
                        return x.trimCurrency();
                    });
                }));
        }

        self.names = function () {
            return Promise.resolve(controls.names
                .map(function (control) {
                    return control.getText();
                }));
        }

        self.containsPlan = function (name, premium) {
            return Promise.all([self.names(), self.premiums()])
            .spread(function(names, premiums) { return names.indexOf(name) != -1 && premiums.indexOf(premium) != -1; });
        };
    };
})();