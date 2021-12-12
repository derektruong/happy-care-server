const generateBasicResponse = (success, error, message) => {
	return {
		success,
		error,
		message
	}
}

const leanArray = (array) => {
	array.forEach((_item, index) => {
		array[index].__v = undefined;
		array[index].createdAt = undefined;
		array[index].updatedAt = undefined;
		array[index].isDeleted = undefined;
	});

	return array;
};

const leanObject = (object) => {
	object.__v = undefined;
	object.createdAt = undefined;
	object.updatedAt = undefined;
	object.isDeleted = undefined;
	
	return object;
};

module.exports = {
	generateBasicResponse,
	leanArray,
	leanObject,
};