const debug = require('debug')('Service:gRPC:ServerAgent');
const Groa = require('groa');
const Router = require('groa-router');

module.exports = class Agent {

	constructor(opts) {
		this.opts = opts;
		this.status = Groa.status;
		this.server = new Groa();
		this.router = new Router();

		// Initializing router
		this.server.use(this.router.routes());
	}

	getServer() {
		return this.server;
	}

	getRouter() {
		return this.router;
	}

	async initialize() {

		this.server.addProto(this.opts.protoFiles);
	}

	async loadProto(filename) {

		await this.server.loadProto(filename);
	}

	start() {

		debug('Starting gRPC server...');

		return new Promise((resolve, reject) => {

			this.server.listen(this.opts.port, this.opts.host, (err) => {
				if (err)
					return reject(err);

				debug('Listening to ' + this.opts.host + ':' + this.opts.port);
				resolve();
			});
		});
	}
};
