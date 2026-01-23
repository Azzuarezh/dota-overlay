import { handler } from './build/handler.js';   // generated after build
import express from 'express';
import { createServer } from 'http';
import cors from 'cors'
import injectSocketIO from './socketIo/socketIoHandler.js';
import bodyParser from 'body-parser';
const app = express();
app.use(cors())
app.set("etag", false);
app.set("x-powered-by", false);
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}))
// ---- SvelteKit handler ----
app.use(handler);
const httpServer = createServer(app);

injectSocketIO(httpServer)

httpServer.listen(3000, function () { // Start the Express server on port 3001
    console.log('listening on *:3000');
});