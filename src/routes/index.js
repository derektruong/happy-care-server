const UserRoute = require('./user.route');
const SpecializationRoute = require('./specialization.route');

const initRoutes = (app) => {
	app.use(UserRoute);
	app.use(SpecializationRoute);
}

module.exports = initRoutes;