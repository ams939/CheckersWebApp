"use strict";

/*
 * The purpose of this file is to provide a common interface for
 * iteracting with the server (both static and websocket) of the
 * checkers application.
 */

import WSMessage from "./WSMessage.js";
const { MessageType } = WSMessage;


var wsConnection     = null;
var responseHandlers =
{ [MessageType.gameFound]: null
, [MessageType.quitGame]: null
, [MessageType.movePiece]: null
, [MessageType.joinQueue]: null
, [MessageType.setUsername]: null
, [MessageType.opponentDisconnected]: null
};

class Network
{
	constructor()
	{
	}

	static connect(url=DEV_WS_URL)
	{
		wsConnection = new WebSocket(url);
		wsConnection.addEventListener("message", Network.handleMessage);
	}


	static sendMessage(message)
	{
		if( wsConnection )
		{
			wsConnection.send(JSON.stringify(message));
		}
	}

	// === CLIENT MESSAGE ALIASES =============================================
	static setUsername(username)
	{
		let message = new WSMessage(MessageType.setUsername, { username: username });
		Network.sendMessage(message);
	}

	static joinQueue()
	{
		let message = new WSMessage(MessageType.joinQueue, {});
		Network.sendMessage(message);
	}

	static leaveQueue()
	{
		let message = new WSMessage(MessageType.leaveQueue, {});
		Network.sendMessage(message);
	}

	static movePiece(oldPosition, newPosition, sessionId)
	{
		let message = new WSMessage(MessageType.movePiece, { pos: oldPosition, new_pos: newPosition, session_id: sessionId });
		Network.sendMessage(message);
	}
	// ========================================================================


	// === SERVER MESSAGE HANDLERS ============================================
	static handleMessage(event)
	{
		console.log(event); // DB DB DB
		// Attempt to parse the response and extract the code.
		// Then, switch on the code and dispatch the message to the appropriate
		// message handler.
		let response = JSON.parse(event.data);
		let responseMessage = WSMessage.parseMessage(response);

		// DB DB DB
		console.log("Message received: ", responseMessage);

		let handler = responseHandlers[responseMessage.code];
		if( typeof handler === "function" )
		{
			handler(responseMessage);
		}
		else
		{
			throw new Error(`Message handler for opcode ${responseMessage.code} is not a function.  Type: ${typeof handler}`);
		}
	}

	static registerResponseHandler(opcode, handler)
	{
		if( typeof responseHandlers[opcode] !== "function" )
		{
			responseHandlers[opcode] = handler;
		}
	}
	// ========================================================================
}

window.setUsername = Network.setUsername; // DB DB DB DB DB

export default Network;