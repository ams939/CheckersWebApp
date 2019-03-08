"use strict";

// Imports
import WSMessage from "./WSMessage.js";
const { MessageType } = WSMessage;

// Constants
const DEFAULT_WS_WAIT_TIMEOUT      = 15000; // in milliseconds
const WS_CONNECTION_CHECK_INTERVAL = 5; // in milliseconds

// Global State (module is static)
var wsConnection     = null;
var responseHandlers =
{ [MessageType.gameFound]: null
, [MessageType.quitGame]: null
, [MessageType.movePiece]: null
, [MessageType.joinQueue]: null
, [MessageType.setUsername]: null
, [MessageType.opponentDisconnected]: null
};

// Private functions
function _waitForWebSocketReadyHelper(ws, readyCallback, timeoutCallback, timeoutMs, elapsedTimeMs)
{
	setTimeout(() =>
	{
		if( ws.readyState === 1 )
		{
			readyCallback();
			return;
		}
		else if( elapsedTimeMs >= timeoutMs )
		{
			// We've timed out
			timeoutCallback();
			return;
		}
		
		// Otherwise, recurse
		_waitForWebSocketReadyHelper(ws, readyCallback, timeoutCallback, timeoutMs, elapsedTimeMs + WS_CONNECTION_CHECK_INTERVAL);

	}, WS_CONNECTION_CHECK_INTERVAL); // wait a minimum of 5ms between checks
}






class Network
{
	constructor()
	{
	}

	// === UTILITIES ==========================================================
	static connect(url=DEV_WS_URL)
	{
		wsConnection = new WebSocket(url);
		wsConnection.addEventListener("message", Network.handleMessage);
	}


	static waitForWebSocketReady(timeout=DEFAULT_WS_WAIT_TIMEOUT)
	{
		return new Promise((resolve, reject) =>
		{
			if( !wsConnection )
			{
				reject("WebSocket connection does not exist.");
				return;
			}

			// If the ws connection exists, bootstrap a recursive wait routine
			_waitForWebSocketReadyHelper(wsConnection, resolve, reject, timeout, 0);
		});
	}


	static sendMessage(message)
	{
		if( wsConnection )
		{
			wsConnection.send(JSON.stringify(message));
		}
	}
	// ========================================================================

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
		// Attempt to parse the response and extract the code.
		// Then, switch on the code and dispatch the message to the appropriate
		// message handler.
		let response = JSON.parse(event.data);
		let responseMessage = WSMessage.parseMessage(response);

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

	static unregisterResponseHandler(opcode)
	{
		responseHandlers[opcode] = null;
	}
	// ========================================================================
}

window.setUsername = Network.setUsername; // DB DB DB DB DB

export default Network;