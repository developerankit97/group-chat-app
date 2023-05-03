const jwt = require('jsonwebtoken');

exports.isStringInvalid = (str) => {
	if (string == undefined || string.length == 0) {
		return true;
	}
	return false;
};

exports.generateToken = (id, email, name) => {
	return jwt.sign(
		{ userId: id, email: email, name: name },
		process.env.TOKEN_SECRET
	);
};

exports.sendError = (res, code, message, success) => {
	res.status(code).send({ message: message, success: success });
};

exports.sendResponse = (res, code, message, success) => {
	res.status(code).send({ message: message, success: success });
};

exports.throwError = (err) => {
	throw new Error(err);
};
