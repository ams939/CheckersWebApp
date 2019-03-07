"use strict";

// Import Modules
import Router  from "./modules/Router.js";
import Network from "./modules/Network.js";

const DEV_WS_URL = "ws://localhost:9000/";

(function(window, undefined)
{
	// Instantiate a new router
	const router = new Router();

	// Open a websocket connection for the client
	Network.connect(DEV_WS_URL);

	window.addEventListener("hashchange", () =>
	{
		if( !window.location.hash.length || window.location.hash === "#/" )
		{
			router.routeTo(Router.Routes.matchmaking);
			return;
		}

		router.renderRoute(window.location.hash);
	});

	window.addEventListener("load", () =>
	{
		// Default to "Login" on load
		// TODO: change this to be dynamic based on whether or not there
		// is a session-saved username!
		let onLoadRoute = Router.Routes.matchmaking;

		if( window.location.hash === onLoadRoute )
		{
			router.renderRoute(onLoadRoute);
			return;
		}

		router.routeTo(onLoadRoute);
	});

}(window));
