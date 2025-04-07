const { normalizePath } = require("../helpers/normalizePath");
const { getMonitorPageByClientAndBaseUrl } = require("../services/monitorPage");



const processURL =  async (req, res, next) => {

    	// get domain and path for the service 
		    // Extrae información del reporte
			const reportUrl = req.body["csp-report"]["document-uri"];
			const urlObj = new URL(reportUrl);
			const reportDomain = urlObj.hostname;
            // Normaliza la ruta según los patrones definidos por el cliente
			const normalizedPath =  normalizePath(urlObj);

			const foundMonitoredPage = await getMonitorPageByClientAndBaseUrl({
				data: {
					clientId: req.clientId,
					normalizedUrl: normalizedPath,
				}
			})

			console.log({
				foundMonitoredPage,
				clientId: req.clientId,
				normalizedUrl: normalizedPath,
			})

			if (!foundMonitoredPage) {
				return res.status(403).json({
					status: "error",
					msg: "Unauthorized",
				});
			}

			req.pageId = foundMonitoredPage.id;
            req.originURL = urlObj.origin;
			req.reportDomain = reportDomain;
			req.reportPath = normalizedPath;
			req.originalPath = urlObj.pathname;
            //! ID from the site/page that our client wanst to monitor.
			// req.monitoredSite = monitoredSite; 

            next()
			
}

module.exports = {
    processURL
}