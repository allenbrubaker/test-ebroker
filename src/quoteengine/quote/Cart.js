(function () {
	
	module.exports = Cart

	// This class is used for planInfo modal, compare page, and cart page.
    // type = 'compare' | 'cart' | 'info'
	function Cart(control, type) {
        
        var control = control || $('[ui-view=quoteEngine]')
        var type = type || 'cart'
        var planVariable = type.match(/compare/i) || type.match(/info/i) ? 'plan' : 'medicalPlan'
		var self = this

		var controls = { 
			names: control.all(by.binding(planVariable + '.display_name')),
			premiums: control.all(by.binding(planVariable + '.premium')),
			back: control.$('.fa-arrow-left'),
			close: control.$('[ng-click^=ok]'),
			checkout: control.$('[ng-click^=goToNext]'),
			agents: $((type.match(/compare/i) ? '.modal-body' : '[ng-show^="modalActive === undefined"]')).all(by.repeater('agent in agents')),
            save: control.$('.fa-save')
		}
		
		self.agents = function () {
			return Promise.resolve(controls.agents.map(function (control) {
				return new Agent(control)
			}))
		}
        
        self.selectFirstAgent = function() {
            return self.agents()
                .first()
                .call('select')
        }
        
		self.premiums = function () {
			return Promise.resolve(controls.premiums
				.map(function (control) {
					return control.getText().then(function (x) {
						return x.trimCurrency()
					})
				}))
		}

		self.names = function () {
			return Promise.resolve(controls.names
				.map(function (control) {
					return control.getText()
				}))
		}

		self.containsPlan = function (name, premium) {
			return Promise.all([self.names(), self.premiums()])
				.spread(function (names, premiums) {
					return names.indexOf(name) != -1 && premiums.indexOf(premium) != -1
				})
		}

		self.clickBack = function () {
			return controls.back.click()
		}

		self.clickClose = function () {
			return controls.close.click()
		}
        
        self.save = function() {
            controls.save.click().sleep(5000)
        }

		self.checkout = function () {
			return scrollDown() // popup sometimes shows up hiding the checkout button.
            .then(function() {controls.checkout.click().sleep(3000)})
		}
        
        var scrollDown = function() {
            return browser.executeScript("scroll(0, 250);");
        }

	}

	function Agent(control) {
		var self = this
		var controls = {
			select: control.$('.btn')
		}
		self.select = function () {
			return controls.select.click().sleep(10000)
		}
	}
})()