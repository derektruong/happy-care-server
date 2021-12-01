const UserRoute = require('./user.route');
const SpecializationRoute = require('./specialization.route');
const RoomRoute = require('./room.route');
const MessageRoute = require('./message.route');

const initRoutes = (app) => {
	app.use('/api/users', UserRoute);
	app.use('/api', SpecializationRoute);
	app.use('/api/rooms', RoomRoute);
	app.use('/api/messages', MessageRoute);
}

module.exports = initRoutes;