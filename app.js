const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const errorController = require('./controllers/error');
const sequelize = require('./utils/database');

const app = express();
app.use(
	cors({
		origin: '*',
		credentials: true,
	})
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ extended: false }));

const signupRoutes = require('./routes/user');

app.use('/user', signupRoutes);

app.use(errorController.get404);

sequelize
	.sync()
	.then(() => {
		app.listen(process.env.PORT);
	})
	.catch((e) => console.log(e));
