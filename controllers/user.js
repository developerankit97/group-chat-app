const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const isStringInvalid = require('../utils/helpers');
const sendResponse = require('../utils/helpers');
const sendError = require('../utils/helpers');
const throwError = require('../utils/helpers');
const { Op } = require('sequelize');

exports.postSignUp = async (req, res, next) => {
	const { name, email, password, phNo } = req.body;
	if (
		isStringInvalid(name) ||
		isStringInvalid(email) ||
		isStringInvalid(password) ||
		isStringInvalid(phNo)
	) {
		return sendError(
			res,
			400,
			'Bad parameters. Something is missing',
			false
		);
	}
	try {
		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				throwError(err);
			}
			bcrypt.hash(password, salt, async (err, hash) => {
				if (err) {
					throwError(err);
				}
				const user = await User.findOrCreate({
					where: { [Op.or]: [{ email: email }, { phNo: phNo }] },
				});
				if (!created) {
					return sendError(
						res,
						204,
						'User already exist with either same email or phonenumber',
						false
					);
				} else {
					return sendResponse(
						res,
						201,
						'Successfully created new user',
						true
					);
				}
			});
		});
	} catch (err) {
		sendError(res, 400, 'Bad Request', false);
	}
};

exports.postLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		console.log(email, password);
		if (isStringInvalid(email) || isStringInvalid(password)) {
			return res.status(400).json({
				message: 'Bad parameters. Something is missing',
				success: false,
			});
		}
		const user = await User.findAll({ where: { email: email } });
		// console.log(user)
		if (user.length > 0) {
			bcrypt.compare(password, user[0].password, (err, result) => {
				if (err) {
					return res.status(500).json({
						message: 'Something went wrong',
						success: false,
					});
				} else if (result == true) {
					return res.status(201).json({
						message: 'Login Successful',
						success: true,
						name: user[0].name,
						email: user[0].email,
						token: generateAccessToken(
							user[0].id,
							user[0].email,
							user[0].name
						),
					});
				} else {
					return res.status(401).json({
						message: 'Password is incorrect',
						success: false,
					});
				}
			});
		} else {
			return res
				.status(404)
				.json({ message: 'User does not exist', success: false });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
};
