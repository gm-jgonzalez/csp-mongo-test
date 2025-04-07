const event = require("../models/event");
const Incident = require("../models/incident");
const { getIncident } = require("./incident");

const parseDisposition = (disposition) => {
	if (disposition === "enforce") {
		return "Enforced";
	} else if (disposition === "report") {
		return "Report";
	} else {
		return disposition;
	}
}

const getEvent = async ({ data: { eventId } }) => {
	console.log({
		eventId,
	});

	try {
		const foundEvent = await Incident.findOne({
			id: eventId,
		});

		return foundEvent;
	} catch (error) {
		console.error("Error al guardar informe:", error);
		throw new Error("Error al guardar informe");
	}
};

const createEvent = async ({ data: { incidentId, newEventBody } }) => {
	console.log({
		incidentId,
		newEventBody,
	});

	try {

		const newEvent = await event.create({
			incidentId: incidentId,
			sourceFile: newEventBody.sourceFile,
			statusCode: newEventBody.statusCode,
			lineNumber: newEventBody.lineNumber,
			columnNumber: newEventBody.columnNumber,
			ipAddress: newEventBody.ipAddress,
			userAgent: newEventBody.userAgent,
			originalReport: newEventBody.originalReport,
			disposition: parseDisposition(newEventBody.disposition),
		});

		// update the incident occurrence count to plus 1
		const incrementedIncident = await Incident.updateOne(
			{_id: incidentId },
			{ $inc: { occurrenceCount: 1 } });

			console.log({
				incrementedIncident
			})
		return newEvent;
	} catch (error) {
		console.error("Error creating the incident:", error);
		throw new Error(error.message);
	}
};

module.exports = {
	createEvent,
	getEvent,
};
