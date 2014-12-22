(function () {

	module.exports = Cart

	// This class is used for planInfo modal, compare page, and cart page.
	function Cart(control, planVariable) {
		control = control || $('[ui-view=quoteEngine]')
		planVariable = planVariable || 'medicalPlan';
		var self = this

		var controls = {
			names: control.all(by.binding(planVariable + '.display_name')),
			premiums: control.all(by.binding(planVariable + '.premium')),
			back: control.$('[ng-click^=goToQuote]'),
			close: control.$('[ng-click^=ok]'),
			checkout: control.$('[ng-click^=goToNext]'),
			agents: element.all(by.repeater('agent in agents')),
		}
		
		self.agents = function () {
			return Promise.resolve(controls.agents.map(function (control) {
				return new Agent(control)
			}))
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

		self.checkout = function () {
			return controls.checkout.click().sleep(10000)
		}

	}

	function Agent(control) {
		var self = this
		var controls = {
			select: control.$('[ng-click^=selectAgent]')
		}
		self.select = function () {
			controls.select.click().sleep(6000)
		}
	}
})()