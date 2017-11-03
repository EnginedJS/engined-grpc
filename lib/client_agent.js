const fs = require('fs');
const path = require('path');
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

	async parseProto(proto) {

		return await Groa.Loader.parseProto(proto);
	}

	async loadProto(filename) {

		debug('Loading', filename);

		await this.client.loadProto(filename);
	}

	loadProtoPath(protoPath) {

		return new Promise((resolve, reject) => {

			fs.readdir(protoPath, async (err, files) => {

				if (err)
					return reject(err);

				try {

					for (let index in files) {
						let file = path.join(protoPath, files[index]);

						await this.loadProto(file);
					}

				} catch(e) {
					return reject(e);
				}

				resolve();
			});
		});
	}

	async start() {

		debug('Starting gRPC Client Agent...');
	}

	async close() {
		await this.client.close();
	}
};
