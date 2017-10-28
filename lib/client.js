const { Service } = require('engined');
const ClientAgent = require('./client_agent');
const debug = require('debug')('Service:gRPC:Client');

module.exports = (opts = {}) => class extends Service {

	constructor(context) {
		super(context);

		this.opts = Object.assign({
			agentName: 'default',
			host: 'localhost',
			port: 50051,
			protoFiles: []
		}, opts);
		this.agent = null;
	}

	async start() {

		this.agent = new ClientAgent(this.opts);

		// Register on context object
		this.getContext()
			.assert('gRPCClient')
			.register(this.opts.agentName, this.agent)

		if (this.initialize) {
			await this.initialize();
		}

		await this.agent.start();
	}

	async stop() {

		if (this.agent) {
			await this.agent.close();
			this.agent = null;
		}

		// Getting agent member
		let agentManager = this.getContext().get('gRPCClient');
		if (!agentManager)
			return;

		// Take off agent from context
		agentManager.unregister(this.opts.agentName);

		if (agentManager.count() === 0)
			this.getContext().remove('gRPCClient');
	}
}
