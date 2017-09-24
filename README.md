# engined-grpc

gRPC service for engined.

[![NPM](https://nodei.co/npm/engined-grpc.png)](https://nodei.co/npm/engined-grpc/)

## Installation

Install via NPM:

```shell
npm install engined-grpc
```

## Usage

start gRPC agent service in engined, see example below:

```javascript
const { Manager } = require('engined');
const GRPCService = require('engined-grpc');

const main = async () => {

	// Create manager
	let serviceManager = new Manager({ verbose: true });

	// Adding agent to manager
	serviceManager.add('GRPC', grpcService);

	// Start all services
	await serviceManager.startAll();
};

main();
```

## License
Licensed under the MIT License
 
## Authors
Copyright(c) 2017 Fred Chien（錢逢祥） <<cfsghost@gmail.com>>
