const router = require('express').Router();
const signupController = require('../controllers/user');

router.post('/signup', signupController.postSignUp);
router.post('/login', signupController.postLogin);

module.exports = router;
