module.exports = Sort;

function Sort(control) {
        var self = this;

        var controls = {
            sortButton: $('.btn-orange-sm.dropdown-toggle'),
            sortPriceDesc: $('[ng-click *= premium][ng-click *= desc]'),
            sortPriceAsc: $('[ng-click *= premium][ng-click *= asc]'),
            sortDeductibleDesc: $('[ng-click *= deductible][ng-click *= desc]'),
            sortDeductibleAsc: $('[ng-click *= deductible][ng-click *= asc]')
        }

        self.sortPremium = function (isAscending) {
            return controls.sortButton.click()
                .then(function () {
                    return isAscending ? controls.sortPriceAsc.click() : controls.sortPriceDesc.click();
                }).sleep(4000);
        }

        self.sortDeductible = function (isAscending) {
            return controls.sortButton.click()
                .then(function () {
                    return isAscending ? controls.sortDeductibleAsc.click() : controls.sortDeductibleDesc.click();
                }).sleep(4000);
        }

    }