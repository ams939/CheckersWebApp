"use strict";

// Import Modules
import Toast     from "./modules/Toast.js";
import Router    from "./modules/Router.js";
import Network   from "./modules/Network.js";
import WSMessage from "./modules/WSMessage.js";
import Utils from "./modules/Utils.js";
const { MessageType } = WSMessage;

const DEV_WS_URL = "ws://localhost:9000/";

(function(window, undefined)
{
	// Instantiate a new router
	const router = new Router();

	// Bind the "toast" function to the window
	window.toast = Toast.create;

	// Open a websocket connection for the client
	Network.connect(DEV_WS_URL);
	console.log("Connection established.");

	function doInitialLoad(onLoadRoute)
	{
		// If the route to be loaded is where we already are, just re-render the page.
		if( window.location.hash === onLoadRoute )
		{
			router.renderRoute(onLoadRoute);
			return;
		}

		// Load the appropriate route
		router.routeTo(onLoadRoute);
	}

	window.addEventListener("hashchange", () =>
	{
		if( !window.location.hash.length || window.location.hash === "#/" )
		{
			router.routeTo(Router.Routes.matchmaking);
			return;
		}

		router.renderRoute(window.location.hash);
	});

	window.addEventListener("load", async function()
	{
		let username = sessionStorage.getItem("username");
		if( username )
		{
			// Unregister previous "setUsername" handler (should be null, but just in case)
			Network.unregisterResponseHandler(MessageType.setUsername);

			// Register a handler that will redirect to the appropriate page
			Network.registerResponseHandler(MessageType.setUsername, (response) =>
			{
				if( response.success )
				{
					// The user was able to successfully reclaim their username.
					// Send them to the matchmaking page.
					console.log(`Reconnected user: ${username}`);
					doInitialLoad(Router.Routes.matchmaking);
				}
				else
				{
					// There was an issue restoring the username.
					// Clear the sessionStorage key and redirect to the login page.
					console.log(`Could not reconnect user "${username}", redirecting to login page.`);
					doInitialLoad(Router.Routes.login);
				}

				// This handler is a "one-off", in that it unregisters itself after being fired
				Network.unregisterResponseHandler(MessageType.setUsername);
			});

			// Try to reconnect to the websocket server with the sessionStorage username
			await Network.waitForWebSocketReady();
			Network.setUsername(username);
		}
		else
		{
			doInitialLoad(Router.Routes.login);
		}
	});

}(window));
