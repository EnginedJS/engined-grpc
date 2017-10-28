const debug = require('debug')('Service:gRPC:ClientAgent');
const Groa = require('groa');
const { Client } = require('groa');

module.exports = class Agent {

	constructor(opts) {
		this.opts = opts;
		this.grpc = Groa.grpc;
		this.status = Groa.status;
		this.Metadata = Groa.Metadata;
		this.client = new Client(opts.host, opts.port);
	}

	getClient() {
		return this.client;
	}

	getRouter() {
		return this.router;
	}

	async loadProto(filename) {

		debug('Loading', filename);

		await this.client.loadProto(filename);
	}

	async start() {

		debug('Starting gRPC Client Agent...');
	}

	async close() {
		await this.client.close();
	}
};
