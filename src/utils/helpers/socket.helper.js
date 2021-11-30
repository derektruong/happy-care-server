const generateBasicAck = (success, error, message) => {
	return {
		success,
		error,
		message
	}
}

module.exports = {
	generateBasicAck,
};