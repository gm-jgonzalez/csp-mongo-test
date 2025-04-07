const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

const cspRouter = require("../routes/csp");
const monitorPageRouter = require("../routes/monitorPage");

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.cspPath = "/api/csp";
		this.monitorPagePath = "/api/monitor-page";

		// Conectar a base de datos
		this.conectarDB();

		// Middlewares
		this.middlewares();

		// Rutas de mi aplicación
		this.routes();
	}

	async conectarDB() {
		await dbConnection();
	}

	middlewares() {
        this.app.disable('x-powered-by');
		// CORS
		this.app.use(cors());

		// Lectura y parseo del body
		this.app.use(express.json());
		this.app.use(express.json({ type: "application/csp-report", limit: "50kb" }));
		this.app.use(express.json({ type: "application/reports+json", limit: "50kb" }));

		// Directorio público
		this.app.use(express.static("public"));
	}

	routes() {
		this.app.use(this.cspPath, cspRouter);
		this.app.use(this.monitorPagePath, monitorPageRouter);
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log("Server running on port: ", this.port);
		});
	}
}

module.exports = Server;
