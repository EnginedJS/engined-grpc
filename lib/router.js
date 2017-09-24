const { Service } = require('engined');
const debug = require('debug')('Service:gRPC:Router');

module.exports = (opts = {}) => class extends Service {

	constructor(context) {
		super(context);

		this.opts = Object.assign({
			agentName: 'default',
			protoFiles: []
		}, opts);
	}

	async initialize(agent) {
	}

	async start() {

		debug('Starting router service');

		let grpcAgent = this.getContext().get('gRPCServer').getAgent(this.opts.agentName);

		// Load all proto files
		let files = this.opts.protoFiles[Symbol.iterator]();

		for (let filename of files) {
			await grpcAgent.loadProto(filename);
			debug('Loaded', filename);
		}

		debug('Initializing router');
		await this.initialize(grpcAgent);
	}

	async stop() {
	}
}
