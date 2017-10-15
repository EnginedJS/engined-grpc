const { Service } = require('engined');
const debug = require('debug')('Service:gRPC:Router');
const path = require('path');
const fse = require('fs-extra');

module.exports = (opts = {}) => class extends Service {

	constructor(context) {
		super(context);

		this.opts = Object.assign({
			agentName: 'default',
			protoFiles: [],
			protoPath: null
		}, opts);
	}

	async initialize(agent) {
	}

	async start() {

		debug('Starting router service');

		let grpcAgent = this.getContext().get('gRPCServer').getAgent(this.opts.agentName);

		if (this.opts.protoPath) {

			await fse.ensureDir(this.opts.protoPath);

			debug('Target proto path was set, copying proto files to it');

			// Copy all proto files
			let files = this.opts.protoFiles[Symbol.iterator]();

			for (let filename of files) {
				let targetPath = path.join(this.opts.protoPath, path.basename(filename));

				// Copy proto file if target file is not yet created
				if (!(await fse.pathExists(targetPath))) {
					debug('Copying file to', targetPath);
					await fse.copy(filename, targetPath);
				}

				// Load file
				await grpcAgent.loadProto(targetPath);

				debug('Loaded', targetPath);
			}
		} else {

			// Load all proto files
			let files = this.opts.protoFiles[Symbol.iterator]();

			for (let filename of files) {
				await grpcAgent.loadProto(filename);
				debug('Loaded', filename);
			}
		}

		debug('Initializing router');
		await this.initialize(grpcAgent);
	}

	async stop() {
	}
}
