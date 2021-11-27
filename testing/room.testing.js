require('../src/db/mongoose');
const RoomService = require('../src/services/room.service');

const roomObj = {
	literalName: 'Minh Dung, Minh Duc',
	memberId: '61992686a9aba376b3ca949c',
	doctor: '61977ee71a88371968183c9d',
}

const verifyRoom = async (roomObj) => {
	const roomId = await RoomService.verifyRoom(roomObj);
	console.log(roomId);
};

verifyRoom(roomObj);