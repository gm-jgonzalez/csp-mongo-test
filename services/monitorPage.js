const monitorPage = require("../models/monitorPage");


const getMonitorPage = async ({ data: { pageId } }) => {
	console.log({
		clientId,
		pageId,
	});

	try {
		const foundPage = await monitorPage.findOne({
			pageId,
		});

		return foundPage;
	} catch (error) {
		console.error("Error al guardar informe:", error);
		throw new Error("Error al guardar informe");
	}
}

const getMonitorPageByClientAndBaseUrl = async ({ data: { clientId, normalizedUrl } }) => {
	console.log({
		clientId, normalizedUrl
	});

	try {
		const foundPage = await monitorPage.findOne({
			clientId,
			normalizedUrls: normalizedUrl
		});

		return foundPage;
	} catch (error) {
		console.error("Error al guardar informe:", error);
		throw new Error("Error al guardar informe");
	}
}

const createMonitorPage = async ({ data: { clientId, baseUrl, name, description, notificationEmails,normalizedUrls } }) => {
	console.log({
		clientId,
		baseUrl,
		name,
		description,
		notificationEmails,
	});

	try {
		const newMonitorPage = await monitorPage.create({
			clientId,
			baseUrl,
			name,
			description,
			notificationEmails,
			normalizedUrls
		});

		return newMonitorPage;
	} catch (error) {
		console.error("Error creating the monitor page:", error);
		throw new Error("Error al Error creating the monitor page informe");
	}
};

module.exports = {
	createMonitorPage,
	getMonitorPage,
	getMonitorPageByClientAndBaseUrl,
};
