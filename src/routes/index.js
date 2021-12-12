const UserRoute = require('./user.route');
const SpecializationRoute = require('./specialization.route');
const SymptomKeywordRoute = require('./symptom-keyword.route');
const RoomRoute = require('./room.route');
const MessageRoute = require('./message.route');
const NewsRoute = require('./news.route');
const DrugRoute = require('./drug.route');
const PrescriptionRoute = require('./prescription.route');

const initRoutes = (app) => {
	app.use('/api/users', UserRoute);
	app.use('/api', SpecializationRoute);
	app.use('/api/symptom-keyword', SymptomKeywordRoute);
	app.use('/api/rooms', RoomRoute);
	app.use('/api/messages', MessageRoute);
	app.use('/api/news', NewsRoute);
	app.use('/api/drugs', DrugRoute);
	app.use('/api/prescriptions', PrescriptionRoute);
}

module.exports = initRoutes;