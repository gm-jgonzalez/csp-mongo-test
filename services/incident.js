const { detectAttack } = require("../helpers/detectAttack");
const Incident = require("../models/incident");
const { getMonitorPage } = require("./monitorPage");

const getIncident = async ({ data: { incidentId } }) => {
	console.log({
		incidentId,
	});

	try {
		const foundIncident = await Incident.findOne({
			id: incidentId,
		});

		if (!foundIncident) {
			throw new Error("Incident not found");
		}

		return foundIncident;
	} catch (error) {
		console.error("Error at getting incident:", error);
		throw new Error(error.message);
	}
};

const getIncidentByViolationHash = async (violationHash) => {
	console.log({
		violationHash,
	});

	try {
		const foundIncident = await Incident.findOne({
			violationHash: violationHash,
		});

		return foundIncident;
	} catch (error) {
		console.error("Error at getting incident:", error);
		throw new Error(error.message);
	}
};

const createIncident = async ({ data: { pageId, newIncidentBody } }) => {
	console.log({
		pageId,
		newIncidentBody,
	});

	try {
		// get attack type and description from DB, based on report information

		const { attackType, attackDescription } = detectAttack(newIncidentBody.blockedResource, newIncidentBody.violatedDirective);
		const newIncident = await Incident.create({
			pageId: pageId._id,
			documentUri: newIncidentBody.documentUri,
			blockedResource: newIncidentBody.blockedResource,
			violatedDirective: newIncidentBody.violatedDirective,
			effectiveDirective: newIncidentBody.effectiveDirective,
			disposition: newIncidentBody.disposition,
			attackType: attackType,
			attackDescription: attackDescription,
			violationHash: newIncidentBody.violationHash,
			lastNotified: new Date(),
		});

		return newIncident;
	} catch (error) {
		console.error("Error creating the incident:", error);
		throw new Error(error.message);
	}
};

const createOrUpdateIncident = async ({ data: { pageId, hash, newIncidentBody } }) => {
	const { attackType, attackDescription } = detectAttack(newIncidentBody.blockedResource, newIncidentBody.violatedDirective);
	const incident = await Incident.findOneAndUpdate(
		{ violationHash: hash }, // Query by violationHash
		{
			$setOnInsert: {
				pageId: pageId,
				documentUri: newIncidentBody.documentUri,
				blockedResource: newIncidentBody.blockedResource,
				violatedDirective: newIncidentBody.violatedDirective,
				effectiveDirective: newIncidentBody.effectiveDirective,
				disposition: newIncidentBody.disposition,
				violationHash: hash,
				attackType: attackType,
				attackDescription: attackDescription,
				status: "new",
			},
		},
		{ upsert: true, new: true } // Create a new document if none exists
	);
	return incident;
};

module.exports = {
	createIncident,
	getIncident,
	getIncidentByViolationHash,
	createOrUpdateIncident,
};
