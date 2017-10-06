const debug = require('debug')('Service:gRPC:ClientAgent');
const grpc = require('grpc');

module.exports = class Agent {

	constructor(opts) {
		this.opts = opts;
		this.client = grpc;
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
