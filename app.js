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
	.then(() => {})
	.catch((e) => console.log(e));

var CronJob = require('cron').CronJob;
var Job = new CronJob(
	'1 1 3 * * *',
	async function () {
		//console.log(" Hello");
		const allChats = await chats.findAll({
			attributes: ['message', 'userId', 'groupId', 'createdAt'],
		});
		console.log('allchats type is ', allChats);
		console.log(
			'allchats are ====> ',
			JSON.parse(JSON.stringify(allChats))
		);

		allChats.forEach((msg) => {
			const durationofmsg =
				new Date().getTime() - msg.createdAt.getTime();
			console.log('Date ==> createdAt format : ', durationofmsg);
			const hour = Math.ceil(durationofmsg / (1000 * 60 * 60));
			if (hour < 24) {
				moveMsgToArchievedChat(msg);
				chats.destroy({
					where: {
						message: msg.message,
						userId: msg.userId,
						groupId: msg.groupId,
					},
				});
			}
		});

		async function moveMsgToArchievedChat(msg) {
			const response = await archivedChat.create({
				message: msg.message,
				userId: msg.userId,
				groupId: msg.groupId,
			});
		}
	},
	null,
	true,
	'America/Los_Angeles'
);
