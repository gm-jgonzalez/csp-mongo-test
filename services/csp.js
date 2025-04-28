const { generateViolationHash } = require("../helpers/generateViolationHash");
const Incident = require("../models/incident");
const { createEvent } = require("./event");
const { getIncidentByViolationHash, createIncident, createOrUpdateIncident } = require("./incident");

const createCspReport = async ({ req, report, clientId, domain, path }) => {
	const informe = req.body["csp-report"];
	const delay = Math.floor(Math.random() * 50) + 50; // 50-100ms aleatorio

	console.log({
		informe,
	});
	// Usar setTimeout para prevenir ataques de canal lateral

	try {
		const hash = generateViolationHash({
			clientId: clientId,
			pageId: req.pageId,
			domain: domain,
			path: path,
			violatedDirective: informe["violated-directive"],
			blockedUri: informe["blocked-uri"],
		});

		console.log({
			informe
		})

		// find incident by violationHash, if found call createEvent,
		// if not found create a new incident, and then call createEvent


	// Use findOneAndUpdate with upsert to handle race conditions
	const incident = await createOrUpdateIncident({
		data: {
			pageId: req.pageId,
			hash: hash,
			newIncidentBody: {
				documentUri: informe["document-uri"],
			blockedResource: informe["blocked-uri"],
			violatedDirective: informe["violated-directive"],
			effectiveDirective: informe["effective-directive"],
			disposition: informe["disposition"],
			violationHash: hash,
			status: "new",
			scriptSample: informe["script-sample"],
			sourceFile: informe["source-file"],
			}
		}
	})

	console.log("Incident found or created:", incident);

		// Create a new event for the incident
		const newEventBody = {
			sourceFile: informe["source-file"],
			statusCode: informe["status-code"],
			lineNumber: informe["line-number"],
			columnNumber: informe["column-number"],
			ipAddress: req.clientIp,
			originalReport: req.originalReport,
			userAgent: req.userAgent,
			disposition: informe["disposition"],
		};

	// Call createEvent to handle the occurrence increment
	await createEvent({ data: { incidentId: incident._id, newEventBody } });


	} catch (error) {
		console.error("Error al guardar informe:", error);
		throw new Error("Error al guardar informe");
	}
};

module.exports = {
	createCspReport,
};
