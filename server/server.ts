import {RegisterAuthEndpoints} from "./Engine/Auth/AuthEndpoints";
import express from "express";
import * as path from "path";
import compression from "compression";
import cookieParser from "cookie-parser";
import serveStatic from "serve-static";
import bodyParser from "body-parser";
import {RegisterGameEndpoints} from "./Engine/Games/Game/GameEndpoints";
import {Config} from "../config/config";
import {CreateGameManager} from "./Engine/Games/Game/GameManager";
import * as Sentry from "@sentry/node";
import {Auth} from "./Engine/Auth/Auth";
import {RegisterPackEndpoints} from "./Engine/Games/Cards/PackEndpoints";
import mongoSanitize from 'express-mongo-sanitize';

require('dotenv').config();

// Create the app
const app = express();
const port = process.env.port || 5000;
const clientFolder = path.join(process.cwd(), 'client');

console.log(`Port is ${port}. Version is ${Config.OutputDir}`);

app.use(Sentry.Handlers.requestHandler() as any);

if (Config.Environment !== "local")
{
	Sentry.init({dsn: 'https://055714bf94b544a79ce023c1bc076ac5@o377988.ingest.sentry.io/5200777'});
}

// Set up basic settings
app.use(express.static(clientFolder, {
	cacheControl: true,
	lastModified: true,
	maxAge: 24 * 60 * 60 * 1000,
	etag: true
}));
app.use(compression() as any);
app.use(cookieParser() as any);
app.use(bodyParser.json({
	type: ['application/json', 'text/plain']
}) as any);
app.use(bodyParser.urlencoded({extended: true}) as any);

app.use(mongoSanitize({
	replaceWith: '_'
}));

app.get("/service-worker.js", (req, res) =>
{
	// Don't cache service worker is a best practice (otherwise clients wont get emergency bug fix)
	res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
	res.set("Content-Type", "application/javascript");
	serveStatic("/service-worker.js");
});

RegisterAuthEndpoints(app, clientFolder);
RegisterPackEndpoints(app, clientFolder);

// must go last
RegisterGameEndpoints(app, clientFolder);

app.use(Sentry.Handlers.errorHandler() as any);

// Start the server
const server = app.listen(port, () => console.log(`Listening on port ${port}, environment: ${Config.Environment}`))
	.setTimeout(10000);

CreateGameManager(server);
Auth.initialize();
