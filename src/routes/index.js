const UserRoute = require('./user.route');
const SpecializationRoute = require('./specialization.route');
const RoomRoute = require('./room.route');
const MessageRoute = require('./message.route');
const NewsRoute = require('./news.route');

const initRoutes = (app) => {
	app.use('/api/users', UserRoute);
	app.use('/api', SpecializationRoute);
	app.use('/api/rooms', RoomRoute);
	app.use('/api/messages', MessageRoute);
	app.use('/api/news', NewsRoute);
}

module.exports = initRoutes;