(function () {

	module.exports = Login

	function Login(control) {
		control = control || $('.modal-dialog')
		var self = this


		var controls = {
			startLogin: control.$('.fa-sign-in'),
			startRegister: control.$('.fa-star'),
			username: loginInput('username'),
			password: loginInput('password'),
			createUsername: createInput('username'),
			createPassword: createInput('password'),
			retypePassowrd: createInput('retypePassword'),
			email: createInput('email'),
			firstName: createInput('fname'),
			lastName: createInput('lname'),
			phone: createInput('pnumber'),
			register: control.element(by.cssContainingText('button', 'Create Account')),
			login: control.element(by.cssContainingText('.btn-success', 'Login')),
			back: control.$('fa-arrow-left'),
			loginAnotherUser: control.element(by.cssContainingText('button', 'Log in as another user'))
		}

		var constants = {
			username: 'QATest3',
			password: 'Test1234'
		}

		function loginInput(property) {
			return control.element(by.model('loginForm.' + property));
		}

		function createInput(property) {
			return control.element(by.model('createForm.' + property));
		}

		function startLogin() {
			return controls.loginAnotherUser.isPresent().then(function (visible) {
				return visible ? controls.loginAnotherUser.click() : controls.startLogin.click()
			})
		}

		self.loginCustom = function (user, pass) {
			startLogin()
				.then(controls.username.clear)
				.then(function () {
					return controls.username.sendKeys(user)
				})
				.then(controls.password.clear)
				.then(function () {
					return controls.password.sendKeys(pass)
				})
				.then(controls.login.click)
				.sleep(4000)
		}

		self.registerCustom = function (user, pass, email, fname, lname, phone) {
			return controls.startRegister.click()
				.then(controls.username.clear)
				.then(function () {
					return controls.username.sendKeys(user)
				})
				.then(controls.password.clear)
				.then(function () {
					return controls.password.sendKeys(pass)
				})
				.then(function () {
					return controls.retypePassword.sendKeys(pass)
				})
				.then(function () {
					return controls.email.sendKeys(email)
				})
				.then(function () {
					return controls.fname.sendKeys(fname)
				})
				.then(function () {
					return controls.lname.sendKeys(lname)
				})
				.then(function () {
					return controls.phone.sendKeys(phone)
				})
				.then(controls.register.click)
				.sleep(6000)
		}

		self.login = function () {
			return self.loginCustom(constants.username, constants.password)
		}

		self.register = function () {
			var user = ''
			for (var i = 0; i < 6; ++i) {
				user += (i == 0 ? 'A' : 'a') + Math.round(Math.random() * 26)
			}
			user += '1'
			return self.register(user, 'Password1', 'user@test.com', 'test', 'user', '1234567890')
		}
	}
})()