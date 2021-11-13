const generateBasicResponse = (success, error, message) => {
	return {
		success,
		error,
		message
	}
}

module.exports = {
	generateBasicResponse,
};