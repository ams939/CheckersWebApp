"use strict";

/*
 * The purpose of this file is to provide a common interface for
 * iteracting with the server (both static and websocket) of the
 * checkers application.
 */

import WSMessage from "./WSMessage.js";
const { MessageType } = WSMessage;


var wsConnection = null;

class Network
{
	constructor()
	{
	}

	static connect(url=DEV_WS_URL)
	{
		wsConnection = new WebSocket(url);
		wsConnection.onmessage = (message) => console.log(message); // DB DB DB
	}


	static sendMessage(message)
	{
		if( wsConnection )
		{
			wsConnection.send(JSON.stringify(message));
		}
	}

	// Alias for specific client message
	static setUsername(username)
	{
		//let message = new WSMessage(MessageType.setUsername, { username: username });
		let message = { code: MessageType.setUsername, username: username };
		return Network.sendMessage(message);
	}

}

window.setUsername = Network.setUsername; // DB DB DB DB DB

export default Network;