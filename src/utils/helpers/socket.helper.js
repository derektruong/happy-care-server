const generateBasicCallback = (success, error, message) => {
	return {
		success,
		error,
		message
	}
}

module.exports = {
	generateBasicCallback,
};