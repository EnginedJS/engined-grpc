const debug = require('debug')('Service:gRPC:ServerAgent');
const Groa = require('groa');
const Router = require('groa-router');

module.exports = class Agent {

	constructor(opts) {
		this.opts = opts;
		this.status = Groa.status;
		this.Metadata = Groa.Metadata;
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

	async parseProto(proto) {

		return await Groa.Loader.parseProto(proto);
	}

	async applyProto(proto, opts) {

		await this.server.applyProto(proto, opts);
	}

	async loadProto(filename, opts) {

		await this.server.loadProto(filename, opts);
	}

	loadProtoPath(protoPath) {

		return new Promise((resolve, reject) => {

			fs.readdir(protoPath, async (err, files) => {

				if (err)
					return reject(err);

				try {

					for (let index in files) {
						let filename = files[index];
						let file = path.join(protoPath, filename);

						if (path.extname(filename) !== '.proto') {
							debug('Ignored', file);
							continue;
						}
							
						debug('Loading', file);

						await this.loadProto(file);
					}

				} catch(e) {
					return reject(e);
				}

				resolve();
			});
		});
	}

	async forceShutdown() {
		await this.server.forceShutdown();
	}

	async tryShutdown() {
		await this.server.tryShutdown();
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
