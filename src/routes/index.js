const UserRoute = require('./user.route');
const SpecializationRoute = require('./specialization.route');
const RoomRoute = require('./room.route');

const initRoutes = (app) => {
	app.use('/api/users', UserRoute);
	app.use('/api', SpecializationRoute);
	app.use('/api/rooms', RoomRoute);
}

module.exports = initRoutes;