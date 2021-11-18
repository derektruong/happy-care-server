const UserRoute = require('./user.route');
const SpecializationRoute = require('./specialization.route');

const initRoutes = (app) => {
	app.use('/api/users', UserRoute);
	app.use('/api', SpecializationRoute);
}

module.exports = initRoutes;