# engined-grpc

gRPC service for engined.

[![NPM](https://nodei.co/npm/engined-grpc.png)](https://nodei.co/npm/engined-grpc/)

## Installation

Install via NPM:

```shell
npm install engined-grpc
```

## Implement gRPC Server

start gRPC server agent service in engined, see example below:

```javascript
const { Manager } = require('engined');
const { Server } = require('engined-grpc');

gRPCService = Server();

const main = async () => {

	// Create manager
	let serviceManager = new Manager({ verbose: true });

	// Adding agent to manager
	serviceManager.add('gRPCServer', gRPCService);

	// Start all services
	await serviceManager.startAll();
};

main();
```

### Customized Router

`engined-grpc` is based on Groa.js which is useful gRPC middleware framework. We can create own router service to load proto file and get `groa-router` object to setup handler.

```javascript
const { Router } = require('engined-grpc');
const path = require('path');

// Create a router service which will load specific proto files
const RouterService = Router({
	protoFiles: [
		path.join(__dirname, 'proto', 'example.proto')
	]
});

module.exports = class gRPCRouterService extends RouterService {

	async initialize(grpcAgent) {

		// Get groa-router object
		let router = grpcAgent.getRouter();

		// Setup handler
		router.rpc('/pipespool.PipeNetwork/Test', async (ctx) => {

			// Return
			ctx.body = {
				content: 'Test!!!'
			};
		});
	}
};
```

## License
Licensed under the MIT License
 
## Authors
Copyright(c) 2017 Fred Chien（錢逢祥） <<cfsghost@gmail.com>>
