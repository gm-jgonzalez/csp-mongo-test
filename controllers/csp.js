const { request, response } = require("express");
const { generateJWT } = require("../helpers/generateJWT");
const { createCspReport } = require("../services/csp");

const getCsp = async (req = request, res = response) => {
	const { body } = req;
	res.json({
		body: body,
		msg: "CSP",
	});
};

const cspReports = async (req = request, res = response) => {
	
	

	try {
		let body;
		if (req.is("application/csp-report")) {body = req.body["csp-report"];}
		if (req.is("application/reports+json")) {body = req.body["csp-report"];}
		console.log({params: req.params, query: req.query})
        console.log({
            log:"antes de createCspReport",
        })

		
		const reportOriginUrl = req.originURL + req.reportPath

		// console.log({
		// 	reportOriginUrl,
		// 	jwtDomain: req.jwtDomain,
		// })
		if (reportOriginUrl !== req.jwtDomain) {
			return res.status(403).json({
				status: "error",
				msg: "Unauthorized",
			});
		}
		const report = req.body["csp-report"];
		const clientId = req.client.id;
		const domain = req.originURL;
		const path = req.reportPath;
		
        await createCspReport({req, report, clientId, domain, path});
		// Responder sin contenido (según estándar para endpoints CSP)
		res.status(204).end();
	} catch (error) {
        console.log({
            error})


		res.status(400).end();
	}
};

const generateToken = async (req = request, res = response) => {
	const body = req.body;

	const jwt = generateJWT(body);

	res
		.json({
			jwt: jwt,
			msg: "Generated Token",
		})
		.status(200);
};

module.exports = {
	getCsp,
	cspReports,
	generateToken,
};
