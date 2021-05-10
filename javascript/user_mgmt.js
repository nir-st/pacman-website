var username;

var users = {
	'k': 'k'
};  // username: password dictionary

$(document).ready(function () {
	
	// login validation
	$("#login-form").validate({
		rules: {
			loginUsername: {
				required: true
			},
			loginPassword: {
				required: true,
			}
		},
		messages: {
			loginUsername: {
				required: "Please enter your username."
			},
			loginPassword: {
				required: "Please enter your password.",
			}
		},
		submitHandler: function(form) {
			let input_username = document.getElementById("login-form").loginUsername.value;
			let input_password = document.getElementById("login-form").loginPassword.value;
			login(input_username, input_password);
		}
	});

	// registration validation
	$("#registration-form").validate({
		rules: {
			regUsername: {
				required: true,
				validateUsername: true
			},
			regPassword: {
				required: true,
				validatePassword: true
			},
			regFullname: {
				required: true,
				validateFullname: true
			},
			regEmail: {
				required: true,
				validateEmail: true
			},
			regBirthdate: {
				required: true
			}
		},
		messages: {
			regUsername: {
				required: "Please enter a username.",
				validateUsername: "Username is not available."
			},
			regPassword: {
				required: "Please enter a password",
				validatePassword: "Password must contain at least 6 characters including numbers and letters."
			},
			regFullname: {
				required: "Please enter your full name.",
				validateFullname: "Full name can not contain digits."
			},
			regEmail: {
				required: "Please enter your email address.",
				validateEmail: "Email address is not valid."
			},
			regBirthdate: {
				required: "Please enter your birthdate."
			}
		},
		submitHandler: function(form) {
			let input_username = document.getElementById("registration-form").regUsername.value;
			let input_password = document.getElementById("registration-form").regPassword.value;
			register(input_username, input_password);
		}
	});
});


$(function() {

	// -- REGISTRATION FORM RULES --

	// password must contain at least 6 digit and contain one number and one char.
	$.validator.addMethod('validatePassword', function (value, element) {
		return value.length >= 6 && /[a-z]/i.test(value) && /\d/.test(value);
	});

	// username already exists
	$.validator.addMethod('validateUsername', function (value, element) {
		return !(value in users);
	});

	// full name contains digits.
	$.validator.addMethod('validateFullname', function (value, element) {
		return !(/\d/.test(value));
	});

	// email address is valid
	$.validator.addMethod('validateEmail', function (value, element) {
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return regex.test(value);	
	});
});


// -- LOGGING IN --
function login(input_username, input_password) {
	
	// username doesn't exist / wrong password
	if (!(input_username in users) || !(users[input_username] === input_password)) {
		document.getElementById("login-error").innerHTML = "Invalid username or password."
	}
	else {
		document.getElementById("login-error").innerHTML = "";
		document.getElementById("login-form").reset();
		set_active_menu_item('settings');
		username = input_username;
	}
}

// -- REGISTERING --
function register(username, password) {
	users[username] = password;
	document.getElementById("registration-msg").innerHTML = "Registration completed! You can now log in.";
	document.getElementById("registration-form").reset();
}