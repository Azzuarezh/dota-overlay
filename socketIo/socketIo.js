import injectSocketIO from './socketIoHandler.js';

export const SocketIoServer = {
	name: 'socketIoServer',
	configureServer(server) {
		injectSocketIO(server.httpServer);
	}
};