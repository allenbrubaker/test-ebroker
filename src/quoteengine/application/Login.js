(function () {

	module.exports = Login

	function Login(control) {
        
		var self = this

		var controls = {
			startLogin: $('.fa-sign-in'),
			startRegister: $('.fa-star'),
			username: loginInput('username'),
			password: loginInput('password'),
			createUsername: createInput('username'),
			createPassword: createInput('password'),
			retypePassowrd: createInput('retypePassword'),
			email: createInput('email'),
			firstName: createInput('fname'),
			lastName: createInput('lname'),
			phone: createInput('pnumber'),
			register: element(by.cssContainingText('button', 'Create Account')),
			login: element(by.cssContainingText('.btn-success', 'Login')),
			back: $('fa-arrow-left'),
			loginAnotherUser: element(by.cssContainingText('button', 'Log in as another user'))
		}

		var constants = {
			username: 'QATest1',
			password: 'Test1234'
		}

		function loginInput(property) {
			return element(by.model('loginForm.' + property));
		}

		function createInput(property) {
			return element(by.model('createForm.' + property));
		}

		function startLogin() {
			return controls.loginAnotherUser.isPresent().then(function (visible) {
				return visible ? controls.loginAnotherUser.click() : controls.startLogin.click()
			})
		}

		self.loginCustom = function (user, pass) {
			return startLogin()
				.then(controls.username.clear)
				.then(function () {
					return controls.username.sendKeys(user)
				})
				.then(controls.password.clear)
				.then(function () {
					return controls.password.sendKeys(pass)
				})
				.then(controls.login.click)
				.sleep(10000)
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
				.sleep(10000)
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