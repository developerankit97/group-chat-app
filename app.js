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
const chatRoutes = require('./routes/chat');
const groupRoutes = require('./routes/group');

const User = require('./models/user');
const Chats = require('./models/chat');
const Group = require('./models/group');
const UserGroup = require('./models/userGroup');

User.hasMany(Chats);
Chats.belongsTo(User);
Group.hasMany(Chats);
Chats.belongsTo(Group);
User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

app.use('/user', signupRoutes);
app.use('/message', chatRoutes);
app.use('/group', groupRoutes);

app.use((req, res) => {
	console.log('Requested URL: ', req.url);
	res.sendFile(path.join(__dirname, `public/${req.url}`));
});

app.use(errorController.get404);

sequelize
	.sync()
	.then(() => {
		app.listen(process.env.PORT);
	})
	.catch((e) => console.log(e));
