"use strict";

/*
 * The purpose of this file is to provide a common interface for
 * iteracting with the server (both static and websocket) of the
 * checkers application.
 */

class Network
{
	constructor()
	{
		// TODO: instantiate websocket connection
	}

	sendMessage(message)
	{
		return new Promise((resolve) =>
		{
		});
	}

	// Alias for specific client message
	setUsername(username)
	{
		let message = new WSMessage(MessageType.setUsername, { username: username });
		return Network.sendMessage(message);
	}

}

export default Network;