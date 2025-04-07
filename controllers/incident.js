const { request, response } = require("express");
const { createMonitorPage } = require("../services/monitorPage");




const newMonitorPage = async (req = request, res = response) => {
	
	try {

		
		const newMonitorPageData = {
			clientId: req.body.clientId,
			baseUrl: req.body.baseUrl,
			name: req.body.name,
			description: req.body.description,
			notificationEmails: req.body.notificationEmails,
		}
		
        const createdMonitorPage = await createMonitorPage({newMonitorPageData});
		
		if (!createdMonitorPage) {
			return res.status(400).json({
				message: "Error creating the monitor page",
			});
		}
		res.status(201).json({
			createdMonitorPage
		});
	} catch (error) {
        console.log({
            error})


		res.status(400).end();
	}
};


module.exports = {
	newMonitorPage
};
