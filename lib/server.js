const { Service } = require('engined');
const ServerAgent = require('./server_agent');
const debug = require('debug')('Service:gRPC:Server');

module.exports = (opts = {}) => class extends Service {

	constructor(context) {
		super(context);

		this.opts = Object.assign({
			host: '0.0.0.0',
			port: 50051,
			agentName: 'default',
			protoFiles: []
		}, opts);
		this.agent = null;
	}

	async start() {

		this.agent = new ServerAgent(this.opts);

		await this.agent.initialize();

		// Register on context object
		this.getContext()
			.assert('gRPCServer')
			.register(this.opts.agentName, this.agent)

		if (this.initialize) {
			await this.initialize();
		}

		await this.agent.start();
	}

	async stop() {

		if (this.agent) {
			// Shutdown server
			await this.agent.forceShutdown();
			this.agent = null;
		}

		// Getting agent member
		let agentManager = this.getContext().get('gRPCServer');
		if (!agentManager)
			return;

		// Take off agent from context
		agentManager.unregister(this.opts.agentName);

		if (agentManager.count() === 0)
			this.getContext().remove('gRPCServer');
	}
}
